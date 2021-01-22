import bottle
#https://gist.github.com/oz123/62bfeb31244cd2ee6411c1ed2a0e00b7
from bottle.ext import beaker
from bottle import route, run, template, response, request, hook
import rdkit
import hdbscan


#app = bottle.app()

# --------- session management ---------

session_opts = {
#    'session.type': 'file',
    'session.type': 'memory',
    'session.cookie_expires': 900,
    'session.auto': True
#    'session.data_dir': './data'
}

app = beaker.middleware.SessionMiddleware(bottle.app(), session_opts)


@hook('before_request')
def setup_request():
    request.session = bottle.request.environ.get('beaker.session')
    
@hook('after_request')
def set_response_headers(): # enable session handling when origin is localhost
    if "Origin" in request.headers.keys() and request.headers["Origin"]==response_header_origin_localhost:
        response.headers['Access-Control-Allow-Origin'] = response_header_origin_localhost
        response.headers['Access-Control-Allow-Credentials'] = "true"
    

# load sdf file and turn it into a dataframe
def sdf_to_df(filename = None, refresh = False):
    
    filename = request.session.get('unique_filename', filename)
    
    if "df" in request.session and not refresh:
        return request.session["df"]

    elif filename: 
        print("---------load-------------")
        
        frame = PandasTools.LoadSDF("./temp-files/%s"%filename, embedProps=True,smilesName=smiles_col,molColName=mol_col)
        frame = frame.drop(columns=[x for x in frame.columns if x.startswith('atom')])
        
        request.session['df'] = frame
        
        return frame
    
    return None
    
# ------------------



# --------- file handling --------
def cleanup_temp(): # TODO: cleanup temp-files, if they are older than one day? or only keep the 5 most recent files?
    now = time.time()
    folder = './temp-files'
    if os.path.exists("./temp-files"):
        files = [os.path.join(folder, filename) for filename in os.listdir(folder)]
        for filename in files:
            if (now - os.stat(filename).st_mtime) > 3600: #remove files that were last modified one hour ago
                os.remove(filename)
                

@bottle.route('/get_uploaded_files_list', method=['GET'])
def get_uploaded_files_list():
    folder = './temp-files'
    if os.path.exists("./temp-files"):
        file_names = [filename for filename in os.listdir(folder)]
        return {"file_list": file_names}

    return {"file_list": []}


@bottle.route('/delete_file/<filename>', method=['GET'])
def get_uploaded_files_list(filename):
    folder = './temp-files'
    if os.path.exists("./temp-files"):
        file = os.path.join(folder, filename)
        if os.path.exists(file):
            os.remove(file)
            return {"deleted": "true"}

    return {"deleted": "false"}

# ------------------

# --------- load SDF ---------

fingerprint_modifier = "fingerprint"
descriptor_names_no_lineup = [fingerprint_modifier, "rep"]
descriptor_names_show_lineup = ["pred", "predicted", "measured"]
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
        # cleanup_temp() # no need to do this anymore because user can delete them in the tool now
        fileUpload = request.files.get("myFile")
        # TODO: find a solution that does not need to save a temp file... or maybe not?
        # print(fileUpload.file.read().decode())
        # print(fileUpload.file.read())
        # print(fileUpload.file) # temporaryFileWrapper

        if not os.path.exists("./temp-files"):
            os.makedirs("./temp-files")

        filename = fileUpload.filename
        if os.path.exists(os.path.join("./temp-files", filename)):
            filename = "%i%s"%(time.time(), fileUpload.filename)
        
        fileUpload.save("./temp-files/%s"%filename, overwrite=True) # the save method can take a file-like object... https://www.kite.com/python/docs/bottle.FileUpload
        fileUpload.file.close()
        
        request.session['unique_filename'] = filename
        
        return {
            'filename': fileUpload.filename,
            'unique_filename': filename,
        }
    else:
        return {}

@bottle.route('/get_csv/', method=['GET'])
@bottle.route('/get_csv/<filename>/', method=['GET'])
@bottle.route('/get_csv/<filename>/<modifiers>', method=['GET'])
#@bottle.route('/get_csv/', method=['GET'])
#@bottle.route('/get_csv/<modifiers>', method=['GET'])
def sdf_to_csv(filename=None, modifiers=None):
    if modifiers:
        descriptor_names_no_lineup.extend([x.strip() for x in modifiers.split(";")]) # split and trim modifier string
        
    if filename: # update filename in session, if it is provided (usecase: maybe user wants to use a dataset that is already uploaded)
        request.session['unique_filename'] = filename
        
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

        if col.startswith(fingerprint_modifier):
            has_fingerprint = True

        if col.startswith(tuple(descriptor_names_no_lineup)):
            modifier = '%s"hideLineUp":true,'%modifier # this modifier tells lineup that the column should not be viewed at all (remove this modifier, if you want to be able to add the column with the sideview of lineup)
            modifier = '%s"featureLabel":"%s",'%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            #col = col.split("_")[1]
        elif col.startswith(tuple(descriptor_names_show_lineup)):
            modifier = '%s"showLineUp":true,'%modifier # this modifier tells lineup that the column should be initially viewed
            modifier = '%s"featureLabel":"%s",'%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            #col = col.split("_")[1]
        else:
            modifier = '%s"showLineUp":true,'%modifier # this modifier tells lineup that the column should be initially viewed
            
        if col == smiles_col:
            modifier = '%s"imgSmiles":true,'%modifier # this modifier tells lineup that a structure image of this smiles string should be loaded

        new_cols.append("%s{%s}"%(col,modifier[0:-1])) # remove the last comma
        
    frame.columns = new_cols

    if not has_fingerprint: # when there are no morgan fingerprints included in the dataset, calculate them now
        fps = pd.DataFrame([list(AllChem.GetMorganFingerprintAsBitVect(mol,5,nBits=256)) for mol in mols])
        fps.columns = ['fingerprint_%s{"hideLineUp":true,"featureLabel": "fingerprint"}'%fp for fp in fps] 
        frame = frame.join(fps)
    
    csv_buffer = StringIO()
    frame.to_csv(csv_buffer, index=False)
    
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

def smiles_to_base64(smiles, highlight=False):
    filename = request.session.get("unique_filename", None)
    if filename and highlight:
        df = sdf_to_df(filename)
        mol = df.set_index(smiles_col).loc[smiles][mol_col]
        weights = [mol.GetAtomWithIdx(i).GetDoubleProp("rep_1") for i in range(mol.GetNumAtoms())]
        fig = SimilarityMaps.GetSimilarityMapFromWeights(mol, weights)
        
        buffered = BytesIO()
        fig.savefig(buffered, format="JPEG", bbox_inches = matplotlib.transforms.Bbox([[0, 0], [6, 6]]))
        img_str = base64.b64encode(buffered.getvalue())
        buffered.close()
        return img_str.decode("utf-8")
    else:
        m = Chem.MolFromSmiles(smiles)
        return mol_to_base64(m)

def mol_to_base64(m):
    pil_img = Draw.MolToImage(m)

    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    buffered.close()
    return img_str.decode("utf-8")

def mol_to_base64_highlight_substructure(mol, patt):
    d = Chem.Draw.rdMolDraw2D.MolDraw2DCairo(250, 250) # MolDraw2DSVG
    hit_ats = list(mol.GetSubstructMatch(patt))
    hit_bonds = []
    for bond in patt.GetBonds():
        aid1 = hit_ats[bond.GetBeginAtomIdx()]
        aid2 = hit_ats[bond.GetEndAtomIdx()]
        hit_bonds.append(mol.GetBondBetweenAtoms(aid1,aid2).GetIdx())
    
    Chem.Draw.rdMolDraw2D.PrepareAndDrawMolecule(d, mol, highlightAtoms=hit_ats, highlightBonds=hit_bonds)
    d.FinishDrawing()

    stream = BytesIO(d.GetDrawingText())
    # image = Image.open(stream).convert("RGBA")

    img_str = base64.b64encode(stream.getvalue())
    stream.close()
    return img_str.decode("utf-8") #d.GetDrawingText()
    
def mol_to_base64_highlight_importances(mol_aligned, patt, current_rep):
    filename = request.forms.get("filename")
    filename = request.session.get("unique_filename", filename)
    if filename:
        df = sdf_to_df(filename)
        if df is not None:
            smiles = Chem.MolToSmiles(mol_aligned)
            mol = df[df[smiles_col] == smiles].iloc[0][mol_col]
            #mol = df.set_index(smiles_col).loc[smiles][mol_col]
            weights = [mol.GetAtomWithIdx(i).GetDoubleProp(current_rep) for i in range(mol.GetNumAtoms())]
            fig = SimilarityMaps.GetSimilarityMapFromWeights(mol_aligned, weights, size=(250, 250))
            
            buffered = BytesIO()
            fig.savefig(buffered, format="JPEG", bbox_inches = matplotlib.transforms.Bbox([[0, 0], [6,6]])) # SVG
            img_str = base64.b64encode(buffered.getvalue())
            #img = buffered.getvalue().decode("utf-8")
            buffered.close()
            return img_str.decode("utf-8") # img
    
    return mol_to_base64_highlight_substructure(mol_aligned, patt)


# --- routing ---

@bottle.route('/get_mol_img', method=['OPTIONS', 'POST'])
def smiles_to_img_post(highlight=False):
    if request.method == 'POST':
        smiles = request.forms.get("smiles")
        return smiles_to_base64(smiles, False)
    else:
        return {}
        
@bottle.route('/get_mol_img/highlight', method=['OPTIONS', 'POST'])
def smiles_to_img_post_highlight():
    if request.method == 'POST':
        smiles = request.forms.get("smiles")
        return smiles_to_base64(smiles, True)
    else:
        return {}


@bottle.route('/get_mol_imgs', method=['OPTIONS', 'POST'])
def smiles_list_to_imgs():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list") 
        current_rep = request.forms.get("current_rep")

        if len(smiles_list) == 0:
            return {}
        if len(smiles_list) == 1:
            return {"img_lst": [smiles_to_base64(smiles_list[0])]}

        mol_lst = [Chem.MolFromSmiles(smiles) for smiles in smiles_list]
        res=Chem.rdFMCS.FindMCS(mol_lst, matchValences=False, ringMatchesRingOnly=False, completeRingsOnly=True) # there are different settings possible here
        patt = res.queryMol
        TemplateAlign.rdDepictor.Compute2DCoords(patt)

        img_lst = []
        for mol in mol_lst:
            TemplateAlign.rdDepictor.Compute2DCoords(mol)
            TemplateAlign.AlignMolToTemplate2D(mol,patt,clearConfs=True)
            if current_rep == "Common Substructure":
                img_lst.append(mol_to_base64_highlight_substructure(mol, patt))
            else:
                img_lst.append(mol_to_base64_highlight_importances(mol, patt, current_rep))

        return {"img_lst": img_lst}
    else:
        return {}


@bottle.route('/get_common_mol_img', method=['OPTIONS', 'POST'])
def smiles_list_to_common_substructure_img():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list")
        if len(smiles_list) == 0:
            return {}
        if len(smiles_list) == 1:
            return smiles_to_base64(smiles_list[0])

        mol_list = [ Chem.MolFromSmiles(smiles) for smiles in smiles_list ]
        res = rdFMCS.FindMCS(mol_list, matchValences=False, ringMatchesRingOnly=False, completeRingsOnly=True)
        m = res.queryMol
        pil_img = Draw.MolToImage(m)

        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        return img_str.decode("utf-8")
    else:
        return {}
        
        
@bottle.route('/get_atom_rep_list', method=["GET"])
@bottle.route('/get_atom_rep_list/<filename>', method=["GET"])
def get_atom_rep_list(filename=None):
    filename = request.session.get("unique_filename", filename)
    if filename:
        df = sdf_to_df(filename)
        if df is not None:
            rep_list = [rep for rep in df.Molecule[0].GetAtomWithIdx(0).GetPropsAsDict().keys() if not rep.startswith('_')]
            return {"rep_list": rep_list}
    
    return {"rep_list":[]}
    
  
# ------------------
        
        
        
        
# --------- clustering ---------

import json
@bottle.route('/segmentation', method=['OPTIONS', 'POST'])
def segmentation():
    if request.method == 'POST':
        X = np.array(json.load(request.body))
        print(X)

        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=10,
            min_samples=4,
            prediction_data=True#,
            #metric=segmentDistance
            )
        
        clusterer.fit_predict(X)

        print(clusterer.labels_)
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
