import bottle
#https://gist.github.com/oz123/62bfeb31244cd2ee6411c1ed2a0e00b7
from bottle.ext import beaker
from bottle import route, run, template, response, request, hook
import rdkit
import hdbscan
import pickle


#app = bottle.app()

# --------- session management ---------

session_path = './session_data'
session_opts = {
    'session.timeout': 1800, # timeout after 30 min if no interaction with the session occurs
#    'session.cookie_expires': 20,
    'session.auto': False, # True -> enables automatic saving of session updates
#    'session.type': 'memory',
    'session.type': 'file',
    'session.data_dir': session_path,
}

app = beaker.middleware.SessionMiddleware(bottle.app(), session_opts)


import os
import time
import shutil
def cleanup_session_files(): # TODO: try if it works as expected
    path = session_path
    old = time.time() - 86400 # older than 24h
    
    for root, dirs, files in os.walk(path, topdown=True):
        for _dir in files:
            cur_path = root + "\\" + _dir
            if os.path.getmtime(cur_path) < old:
                os.remove(cur_path)
                #os.remove(root)
                shutil.rmtree(root)

@hook('before_request')
def setup_request():
    request.session = bottle.request.environ.get('beaker.session')
    # the code below shows that there is a memory issue with beaker sessions
    #print("before session")
    #print_memory()
    #print(request.session.keys())
    #print("after session")
    #print_memory()
    try:
        cleanup_session_files()
    except FileNotFoundError:
        print("FileNotFoundError during session file deleting.")
    
    
@hook('after_request')
def set_response_headers(): # enable session handling when origin is localhost
    if "Origin" in request.headers.keys() and request.headers["Origin"]==response_header_origin_localhost:
        response.headers['Access-Control-Allow-Origin'] = response_header_origin_localhost
        response.headers['Access-Control-Allow-Credentials'] = "true"
    
def tryParseFloat(value):
  try:
    return float(value)
  except ValueError:
    return value
    

# not needed for production server
#import psutil
#def print_memory():
#    mem = dict(psutil.virtual_memory()._asdict())
#    print("percent:", mem["percent"], "|", "used MB:", mem["used"]/1000000)

    
import sys
from rdkit import Chem
from rdkit.Chem.PropertyMol import PropertyMol
# adapt LoadSDF method from rdkit. this version creates a pandas dataframe excluding atom specific properties and does not give every property the object type
def my_load_sdf(filename, idName='ID', smilesName="SMILES", molColName='Molecule'):
    
    records = []
    rep_list = set()
    with open(filename, 'rb') as file:
        suppl = Chem.ForwardSDMolSupplier(file)
        i = 0
        for mol in suppl:
            if mol is None:
                continue
            #row = dict((k, tryParseFloat(mol.GetProp(k))) for k in mol.GetPropNames() if not k.startswith("atom"))
            row = {}
            for k in mol.GetPropNames():
                if k.startswith("atom"):
                    rep_list.add(k)
                else:
                    row[k] = tryParseFloat(mol.GetProp(k))
            
            if mol.HasProp('_Name'):
                row[idName] = mol.GetProp('_Name')
            if smilesName is not None:
                try:
                    row[smilesName] = Chem.MolToSmiles(mol)
                except:
                    row[smilesName] = None
            if molColName is not None:
                row[molColName] = pickle.dumps(PropertyMol(mol), protocol=4)
            records.append(row)
            
            i += 1
            
        
    frame = pd.DataFrame(records)
    del records
    return frame, list(rep_list)
        
# load sdf file and turn it into a dataframe
def sdf_to_df(filename = None, refresh = False):

    if filename is None or filename == "":
        filename = request.session.get("unique_filename", None)
    
    if "df" in request.session and not refresh:
        #print(request.session["df"].memory_usage(index=True, deep=True).sum()/1000000)
        df = request.session["df"]
        if df is not None:
            return request.session["df"]

    elif filename: 
        if request.session.get("loading", False):
            return None
            
        try:
            request.session["loading"] = True
            print("---------load-------------")
            
            request.session['df'] = None # get old df out of memory
            request.session.save()
            
            if os.path.exists("./temp-files/%s.pkl"%filename.split('.')[0]):
                print("load_pickle")
                frame = pd.read_pickle("./temp-files/%s.pkl"%filename.split('.')[0])
            else:
                print("load_sdf")
                frame, rep_list = my_load_sdf("./temp-files/%s.sdf"%filename.split('.')[0],smilesName=smiles_col,molColName=mol_col)
                
                print("end load_sdf")
                frame = frame.fillna(0)
                frame = frame.replace("nan", 0)
                frame.to_pickle("./temp-files/%s.pkl"%filename.split('.')[0], protocol=4)
                
                with open("./temp-files/%s_rep_list.pkl"%filename.split('.')[0], 'wb') as file:
                    pickle.dump(rep_list, file, protocol=4)
                    
                # we don't need the sdf file anymore at this point
                delete_uploaded_file(filename, sdf_only=True)
            
            request.session['df'] = frame
            request.session["loading"] = False
            request.session["unique_filename"] = filename
            request.session.save()
            
            return frame
        
        finally:
            request.session["loading"] = False
            request.session.save()
    
    return None
    
# ------------------



# --------- file handling --------

@bottle.route('/get_uploaded_files_list', method=['GET'])
def get_uploaded_files_list():
    folder = './temp-files'
    if os.path.exists("./temp-files"):
        file_names = [filename.split(".")[0] for filename in os.listdir(folder) if filename.endswith('.sdf') or (filename.endswith('.pkl') and not filename.endswith('_rep_list.pkl'))]
        return {"file_list": list(set(file_names))}

    return {"file_list": []}


@bottle.route('/delete_file/<filename>', method=['GET'])
def delete_uploaded_file(filename, sdf_only = False):
    if filename == "test.sdf" or filename == "test":
        return {"deleted": "false", "error": "can't delete default file"}
    folder = './temp-files'
    if os.path.exists(folder):
        file = os.path.join(folder, '%s.sdf'%filename.split('.')[0])
        file_pkl = os.path.join(folder, '%s.pkl'%filename.split('.')[0])
        file_rep_lst_pkl = os.path.join(folder, '%s_rep_list.pkl'%filename.split('.')[0])
        if os.path.exists(file):
            os.remove(file)
            
        if os.path.exists(file_pkl) and not sdf_only:
            os.remove(file_pkl)
                
        if os.path.exists(file_rep_lst_pkl) and not sdf_only:
            os.remove(file_rep_lst_pkl)
            
        return {"deleted": "true"}

    return {"deleted": "false", "error": "could not delete file. try again later"}

# ------------------

# --------- load SDF ---------

fingerprint_modifier = "fingerprint"
descriptor_names_no_lineup = [fingerprint_modifier, "rep"]
descriptor_names_show_lineup = ["pred", "predicted", "measured"]
smiles_prefix = "smiles"
smiles_col = 'SMILES'
mol_col = "Molecule"

from io import StringIO
import pandas as pd
from rdkit.Chem import PandasTools
from rdkit.Chem import AllChem
import numpy as np
import os
import time



 
@bottle.route('/upload_sdf', method=['OPTIONS', 'POST'])
def upload_sdf():
    if request.method == 'POST':
        fileUpload = request.files.get("myFile")
        supposed_file_size = int(request.forms.get("file_size"))
        if not os.path.exists("./temp-files"):
            os.makedirs("./temp-files")

        filename = fileUpload.filename
        if os.path.exists(os.path.join("./temp-files", filename)):
            filename = "%i%s"%(time.time(), fileUpload.filename)
        
        fileUpload.save("./temp-files/%s"%filename, overwrite=True) # the save method can take a file-like object... https://www.kite.com/python/docs/bottle.FileUpload
        fileUpload.file.close()
        uploaded_file_size = os.stat("./temp-files/%s"%filename).st_size
        if uploaded_file_size == supposed_file_size: # if the filesizes match, the upload was successful
            request.session['unique_filename'] = filename
            request.session.save()
            return {
                'filename': fileUpload.filename,
                'unique_filename': filename,
            }
        else: # if not, the uploaded file does not correspond to the original file and we need to delete it
            if os.path.exists("./temp-files/%s"%filename):
                os.remove("./temp-files/%s"%filename)
            return {"error": "there was a problem with the file upload. please try again"}
    else:
        return {}

import time
@bottle.route('/get_csv/', method=['GET'])
@bottle.route('/get_csv/<filename>/', method=['GET'])
@bottle.route('/get_csv/<filename>/<modifiers>', method=['GET'])
def sdf_to_csv(filename=None, modifiers=None):
    start_time = time.time()
    if modifiers:
        descriptor_names_no_lineup.extend([x.strip() for x in modifiers.split(";")]) # split and trim modifier string
        
    if filename: # if a filename is provided, reset the session to free memory
        request.session.invalidate()
        
    frame = sdf_to_df(filename, refresh=True)
    
    mols = frame[mol_col]
    frame = frame.drop(columns=[mol_col])

    # sort such that the name column comes first and the smiles column comes second
    sm = frame[smiles_col]
    name = frame["ID"]
    frame.drop(labels=[smiles_col, "ID"], axis=1, inplace = True)
    frame.insert(0, "ID", name)
    frame.insert(1, smiles_col, sm)

    has_fingerprint = False
    new_cols = []
    for col in frame.columns:
        modifier = ""
        col_name = col
        
        if col.startswith(fingerprint_modifier):
            has_fingerprint = True

        if col.startswith(tuple(descriptor_names_no_lineup)):
            modifier = '%s"noLineUp":true,'%modifier # this modifier tells lineup that the column should not be viewed at all (remove this modifier, if you want to be able to add the column with the sideview of lineup)
            modifier = '%s"featureLabel":"%s",'%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            split_col = col.split("_")
            col_name = col.replace(split_col[0]+"_", "") + " (" + split_col[0] + ")"
        elif col.startswith(tuple(descriptor_names_show_lineup)):
            #modifier = '%s"showLineUp":true,'%modifier # this modifier tells lineup that the column should be initially viewed
            modifier = '%s"featureLabel":"%s",'%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            split_col = col.split("_")
            col_name = col.replace(split_col[0]+"_", "") + " (" + split_col[0] + ")"
        #else:
            #modifier = '%s"showLineUp":true,'%modifier # this modifier tells lineup that the column should be initially viewed
            
        elif col == smiles_col or col.startswith(smiles_prefix):
            modifier = '%s"project":false,"hideLineUp":true,"imgSmiles":true,'%modifier # this modifier tells lineup that a structure image of this smiles string should be loaded
            
            split_col = col.split("_")
            if len(split_col) >= 2:
                col_name = col.replace(split_col[0]+"_", "") + " (" + split_col[0] + ")"
            
        if col == "ID":
            modifier = '%s"dtype":"string","project":false,'%modifier # TODO: json crashed....
        

        new_cols.append("%s{%s}"%(col_name,modifier[0:-1])) # remove the last comma
        
    frame.columns = new_cols

    if not has_fingerprint: # when there are no morgan fingerprints included in the dataset, calculate them now
        fps = pd.DataFrame([list(AllChem.GetMorganFingerprintAsBitVect(pickle.loads(mol),5,nBits=256)) for mol in mols])
        fps.columns = ['fingerprint_%s{"noLineUp":true,"featureLabel": "fingerprint"}'%fp for fp in fps] 
        frame = frame.join(fps)
    
    csv_buffer = StringIO()
    frame.to_csv(csv_buffer, index=False)
    
    delta_time = time.time()-start_time
    print("took", time.strftime('%H:%M:%S', time.gmtime(delta_time)), "to load file %s"%filename)
    print("took %i min %f s to load file %s"%(delta_time/60, delta_time%60, filename))
    #print("get_csv time elapsed [s]:", time.time()-start_time)
    
    return csv_buffer.getvalue()



# ------------------




# --------- get molecule structure ---------
import base64
from io import BytesIO
from PIL import Image
from rdkit.Chem.Draw import SimilarityMaps
import matplotlib
from bottle import static_file
from rdkit.Chem import Draw
from rdkit import Chem
from rdkit.Chem import TemplateAlign
from rdkit.Chem import rdFMCS


# --- helper functions ---

def get_mcs(mol_list):

    if len(mol_list) <= 1:
        return Chem.MolFromSmiles("*")
        
    if type(mol_list[0])==str:
        mol_list = [Chem.MolFromSmiles(sm) for sm in mol_list] #TODO: handle invalid smiles
        

    res=Chem.rdFMCS.FindMCS(mol_list, timeout=60, matchValences=False, ringMatchesRingOnly=False, completeRingsOnly=False) #completeRingsOnly=True # there are different settings possible here
    if(res.canceled):
        patt = Chem.MolFromSmiles("*")
    else:
        patt = res.queryMol
    
    return patt

def smiles_to_base64(smiles):
    m = Chem.MolFromSmiles(smiles)
    if m:
        return mol_to_base64(m)
    else:
        return "invalid smiles"

def mol_to_base64(m):
    pil_img = Draw.MolToImage(m)

    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    buffered.close()
    return img_str.decode("utf-8")

def mol_to_base64_highlight_substructure(mol, patt, width=250, d = None, showMCS=True):
    width = int(width)
    
    if d is None:
        d = Chem.Draw.rdMolDraw2D.MolDraw2DCairo(width, width) # MolDraw2DSVG
    if showMCS:
        hit_ats = list(mol.GetSubstructMatch(patt))
        hit_bonds = []
        for bond in patt.GetBonds():
            aid1 = hit_ats[bond.GetBeginAtomIdx()]
            aid2 = hit_ats[bond.GetEndAtomIdx()]
            hit_bonds.append(mol.GetBondBetweenAtoms(aid1,aid2).GetIdx())
        
        col = (0,0,0, 0.1) # specify black color for each atom and bond index
        atom_cols = {}
        for i, at in enumerate(hit_ats):
            atom_cols[at] = col
        bond_cols = {}
        for i, bd in enumerate(hit_bonds):
            bond_cols[bd] = col
        
        Chem.Draw.rdMolDraw2D.PrepareAndDrawMolecule(d, mol, highlightAtoms=hit_ats, highlightBonds=hit_bonds, highlightAtomColors=atom_cols, highlightBondColors=bond_cols)
    
    d.FinishDrawing()
    stream = BytesIO(d.GetDrawingText())
    # image = Image.open(stream).convert("RGBA")
    img_str = base64.b64encode(stream.getvalue())
    stream.close()
    return img_str.decode("utf-8") #d.GetDrawingText()

import re
def mol_to_base64_highlight_importances(df, mol_aligned, patt, current_rep, contourLines, scale, sigma, showMCS, width=250):
    contourLines = int(contourLines)
    scale = float(scale)
    sigma = float(sigma)
    showMCS = showMCS == "true"
    width = int(width)
    
    if sigma <= 0:
        sigma = None
    
    
    if df is not None:
        if df is not None:
            d = Chem.Draw.rdMolDraw2D.MolDraw2DCairo(width, width) # MolDraw2DSVG
            smiles = Chem.MolToSmiles(mol_aligned)
            mol = pickle.loads(df[df[smiles_col] == smiles].iloc[0][mol_col])
            #mol = df.set_index(smiles_col).loc[smiles][mol_col]
            #weights = [mol.GetAtomWithIdx(i).GetDoubleProp(current_rep) for i in range(mol.GetNumAtoms())]
            weights = [float(prop) for prop in re.split(' |\n',mol.GetProp(current_rep))]
            fig = SimilarityMaps.GetSimilarityMapFromWeights(mol_aligned, weights, size=(width, width), draw2d=d, contourLines=contourLines, scale=scale, sigma=sigma)
            
            #buffered = BytesIO()
            #fig.savefig(buffered, format="JPEG", bbox_inches = matplotlib.transforms.Bbox([[0, 0], [6,6]])) # SVG
            #img_str = base64.b64encode(buffered.getvalue())
            #img = buffered.getvalue().decode("utf-8")
            #buffered.close()
            #return img_str.decode("utf-8") # img
            return mol_to_base64_highlight_substructure(mol_aligned, patt, d=fig, showMCS=showMCS, width=width)
    
    return mol_to_base64_highlight_substructure(mol_aligned, patt, width=width)


# --- routing ---
import copy
@bottle.route('/get_difference_highlight', method=['OPTIONS', 'POST'])
def smiles_to_difference_highlight():
    if request.method == 'POST':
        smilesA = request.forms.get("smilesA").split(",")
        smilesB = request.forms.get("smilesB").split(",")
        
        if type(smilesA)==list:
            if len(smilesA) <= 1:
                smilesA = smilesA[0]
                molA = Chem.MolFromSmiles(smilesA)
            else:
                molA = get_mcs(smilesA)
                smilesA = Chem.MolToSmiles(molA)
        else:
            molA = Chem.MolFromSmiles(smilesA)
            
        if type(smilesB) == list:
            if len(smilesB) <= 1:
                smilesB = smilesB[0]
                molB = Chem.MolFromSmiles(smilesB)
            else:
                molB = get_mcs(smilesB)
                smilesB = Chem.MolToSmiles(molB)
        else:
            molB = Chem.MolFromSmiles(smilesB)
        
        
        # need a copy because otherwise the structure is messed up
        molA_cpy = copy.deepcopy(molA)#molA#Chem.MolFromSmarts(smilesA)
        molB_cpy = copy.deepcopy(molB)#molB#Chem.MolFromSmarts(smilesB)
        #mol_cpy = molB_cpy
        patt = get_mcs([molA_cpy, molB_cpy])
        
        mol = molB
        
        highlight_atoms = set(range(len(mol.GetAtoms()))) - set(mol.GetSubstructMatch(patt))
        highlight_bonds = [bond.GetIdx() for bond in mol.GetBonds() if bond.GetBeginAtomIdx() in highlight_atoms or bond.GetEndAtomIdx() in highlight_atoms]
        print(highlight_atoms, mol.GetSubstructMatch(patt))

        highlight_atom_colors = {i: (0,0.49,0.68) for i in highlight_atoms}
        highlight_bond_colors = {i: (0,0.49,0.68) for i in highlight_bonds}
        #print(mol_cpy.GetSubstructMatch(patt), mol.GetSubstructMatch(patt), highlight_atoms)

        d = Chem.Draw.rdMolDraw2D.MolDraw2DCairo(200, 200)
        Chem.Draw.rdMolDraw2D.PrepareAndDrawMolecule(d, mol, highlightAtoms=highlight_atoms, highlightBonds=highlight_bonds, highlightAtomColors=highlight_atom_colors, highlightBondColors=highlight_bond_colors)
        
        d.FinishDrawing()
        
        stream = BytesIO(d.GetDrawingText())
        
        img_str = base64.b64encode(stream.getvalue())
        stream.close()
        return {"data": img_str.decode("utf-8")}
        #return {"data": mol_to_base64(mol)}
    else:
        return {}

@bottle.route('/get_mol_img', method=['OPTIONS', 'POST'])
def smiles_to_img_post():
    if request.method == 'POST':
        smiles = request.forms.get("smiles")
        img = smiles_to_base64(smiles)
        return {"data": img}
    else:
        return {}
        

@bottle.route('/get_mol_imgs', method=['OPTIONS', 'POST'])
def smiles_list_to_imgs():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list") 
        current_rep = request.forms.get("current_rep")
        contourLines = request.forms.get("contourLines")
        scale = request.forms.get("scale")
        sigma = request.forms.get("sigma")
        showMCS = request.forms.get("showMCS")
        width = request.forms.get("width")
        doAlignment = request.forms.get("doAlignment") == "true"

        if len(smiles_list) == 0:
            return {"error": "empty SMILES list"}
        #if len(smiles_list) == 1:
        #    return {"img_lst": [smiles_to_base64(smiles_list[0])]}

        mol_lst = []
        error_smiles = []
        for smiles in smiles_list:
            mol = Chem.MolFromSmiles(smiles)
            if mol:
                mol_lst.append(mol)
            else:
                error_smiles.append(smiles)
                
        if len(mol_lst) > 1:
            patt = get_mcs(mol_lst)
            
            TemplateAlign.rdDepictor.Compute2DCoords(patt)
        else:
            patt = Chem.MolFromSmiles("*")

        df = None
        if current_rep != "Common Substructure":
            filename = request.forms.get("filename")
            df = sdf_to_df(filename)
            
        img_lst = []
        for mol in mol_lst:
            if doAlignment: # if user disables alignment, skip
                if(patt and Chem.MolToSmiles(patt) != "*"): # if no common substructure was found, skip the alignment
                    TemplateAlign.rdDepictor.Compute2DCoords(mol)
                    match = mol.GetSubstructMatch(patt)
                    TemplateAlign.AlignMolToTemplate2D(mol,patt,match=match,clearConfs=True)
            if current_rep == "Common Substructure":
                img_lst.append(mol_to_base64_highlight_substructure(mol, patt, width=width))
            else:
                img_lst.append(mol_to_base64_highlight_importances(df, mol, patt, current_rep, contourLines, scale, sigma, showMCS, width))

        return {"img_lst": img_lst, "error_smiles": error_smiles}
    else:
        return {}


@bottle.route('/get_common_mol_img', method=['OPTIONS', 'POST'])
def smiles_list_to_common_substructure_img():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list")
        if len(smiles_list) == 0:
            return {"error": "empty SMILES list"}
        if len(smiles_list) == 1:
            ret = smiles_to_base64(smiles_list[0])
            return {"data": ret, "smiles": smiles_list[0]}

        mol_lst = []
        error_smiles = []
        for smiles in smiles_list:
            mol = Chem.MolFromSmiles(smiles)
            if mol:
                mol_lst.append(mol)
            else:
                error_smiles.append(smiles)
                
        m = get_mcs(mol_lst)
        pil_img = Draw.MolToImage(m)

        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        return {"data": img_str.decode("utf-8"), "smiles": Chem.MolToSmiles(m)}
    else:
        return {}
        
        
@bottle.route('/get_atom_rep_list', method=["GET"])
@bottle.route('/get_atom_rep_list/<filename>', method=["GET"])
def get_atom_rep_list(filename=None):
    
    rep_list = None
    
    if filename is None or filename == "":
        filename = request.session.get("unique_filename", None)
    
    if os.path.exists("./temp-files/%s_rep_list.pkl"%filename.split('.')[0]):
        with open("./temp-files/%s_rep_list.pkl"%filename.split('.')[0], 'rb') as file:
            rep_list = pickle.load(file)
            
    if rep_list is not None:
        print("from pkl")
        return {"rep_list": rep_list}
        
    print("from mol")
    if filename:
        df = sdf_to_df(filename)
        if df is not None:
            rep_list = [rep for rep in pickle.loads(df[mol_col][0]).GetPropNames() if rep.startswith('atom')]
            
            with open("./temp-files/%s_rep_list.pkl"%filename.split('.')[0], 'wb') as file:
                pickle.dump(rep_list, file, protocol=4)
            
            print("from mol")
            return {"rep_list": rep_list}
    
    return {"rep_list":[], "error": "no filename specified"}
    
  
# ------------------
        
        
# --------- search & filter ---------
@bottle.route('/get_substructure_count', method=['OPTIONS', 'POST'])
def smiles_list_to_substructure_count():
    if request.method == 'POST':
        smiles_list = request.forms.get("smiles_list").split(",")
        filter_smiles = request.forms.get("filter_smiles")
        
        if len(smiles_list) == 0:
            return {"error": "empty SMILES list"}
        
        patt = Chem.MolFromSmiles(filter_smiles)
        if patt:
            substructure_counts = [(smiles, len(Chem.MolFromSmiles(smiles).GetSubstructMatch(patt))) for smiles in smiles_list if Chem.MolFromSmiles(smiles) is not None]
            return {"substructure_counts": substructure_counts}
        return {"error": "invalid SMILES filter"}
    else:
        return {}
        
# ------------------
        
        
# --------- clustering ---------

import json
@bottle.route('/segmentation', method=['OPTIONS', 'POST'])
def segmentation():
    if request.method == 'POST':
        #clusterVal = request.forms.get("clusterVal")
        min_cluster_size_arg = request.forms.get("min_cluster_size")
        min_cluster_samples_arg = request.forms.get("min_cluster_samples")
        allow_single_cluster_arg = request.forms.get("allow_single_cluster")
        X = np.array(request.forms.get("X").split(","), dtype=np.float64)[:,np.newaxis].reshape((-1,2))
        
        # many small clusters
        min_cluster_size = 5
        min_cluster_samples = 1
        allow_single_cluster = False
        
        if min_cluster_size_arg:
            min_cluster_size = int(min_cluster_size_arg)
        if min_cluster_samples_arg:
            min_cluster_samples = int(min_cluster_samples_arg)
        if allow_single_cluster_arg == "true":
            allow_single_cluster = bool(allow_single_cluster_arg)


        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_cluster_samples,
            #prediction_data=True, # needed for soft clustering, or if we want to add points to the clustering afterwards
            allow_single_cluster=allow_single_cluster # maybe disable again
            )
        
        clusterer.fit_predict(X)

        #print(clusterer.labels_)
        #clusterer.probabilities_ = np.array(len(X))

        return {
            'result': [ int(label) for label in clusterer.labels_]
        }
        
    else:
        return {}
        
        
# ------------------
        
        
        
        
       
# --------- server management --------- 
        
        
# static files
#TODO maybe there is a better solution to provide the static files to the index.html, but for now this works
@route('/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./dist/')  # ../dist



@route('/')
def server_static(filepath="index.html"):
    return static_file(filepath, root='./dist/')  # ../dist

@bottle.route('/healthcheck', method=["GET"])
def healthcheck():
    print("ok python") #html
    return "healthcheck"
    
@bottle.route('/test')
def test():
    s = bottle.request.environ.get('beaker.session')
    s['test'] = s.get('test',0) + 1
    s.save()
    return 'Test counter: %d' % s['test']
    
# Filter that allows cors request, needed for javascript to work
# CONSTANTS
# https://medium.com/swlh/7-keys-to-the-mystery-of-a-missing-cookie-fdf22b012f09
response_header_origin_all = '*'
# response_header_origin_localhost = 'http://127.0.0.1:5500'
response_header_origin_localhost = 'http://localhost:8080' # use this for Docker 
class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = response_header_origin_all
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors

bottle.install(EnableCors())


#app.run(port=8080) # not working for docker and apparently not needed

# CONSTANTS
# run(app=app, host='localhost', port=8080, debug=True, reloader=True)
run(app=app, host='0.0.0.0', port=8080) # use for docker


# ------------------
