import bottle
from bottle import route, run, template, response, request
from rdkit import Chem
import rdkit



# Filter that allows cors request, needed for javascript to work
class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            # response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5500'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors

app = bottle.app()


import os
import time
def cleanup_temp(): # TODO: cleanup temp-files, if they are older than one day? or only keep the 5 most recent files?
    now = time.time()
    folder = './temp-files'
    files = [os.path.join(folder, filename) for filename in os.listdir(folder)]
    for filename in files:
        if (now - os.stat(filename).st_mtime) > 3600: #remove files that were last modified one hour ago
            os.remove(filename)


import os
import time
@app.route('/upload_sdf', method=['OPTIONS', 'POST'])
def upload_sdf():
    if request.method == 'POST':
        cleanup_temp()
        fileUpload = request.files.get("myFile")
        # TODO: find a solution that does not need to save a temp file... or maybe not?
        # print(fileUpload.file.read().decode())
        # print(fileUpload.file.read())
        # print(fileUpload.file) # temporaryFileWrapper
        filename = "%i%s"%(time.time(), fileUpload.filename)
        fileUpload.save("./temp-files/%s"%filename, overwrite=True) # the save method can take a file-like object... https://www.kite.com/python/docs/bottle.FileUpload
        
        return {
            'filename': fileUpload.filename,
            'unique_filename': filename,
        }
    else:
        return {}


fingerprint_modifier = "fingerprint"
descriptor_names_no_lineup = [fingerprint_modifier, "rep"]
descriptor_names_show_lineup = ["pred", "predicted", "measured"]
smiles_col = 'SMILES'

from io import StringIO
import pandas as pd
from rdkit.Chem import PandasTools
from rdkit.Chem import AllChem
import numpy as np
@app.route('/get_csv/<filename>', method=['GET'])
def sdf_to_csv(filename):
    frame = PandasTools.LoadSDF("./temp-files/%s"%filename, embedProps=True,smilesName=smiles_col,molColName='Molecule')
    frame = frame.drop(columns=[x for x in frame.columns if x.startswith('atom')])
    molecule_df = frame["Molecule"]
    frame = frame.drop(columns=["Molecule"])

    has_fingerprint = False
    new_cols = []
    for col in frame.columns:
        modifier = ""
        if col.startswith(fingerprint_modifier):
            has_fingerprint = True

        if col.startswith(tuple(descriptor_names_no_lineup)):
            modifier = "%slineup_none;"%modifier # this modifier tells lineup that the column should not be viewed at all (remove this modifier, if you want to be able to add the column with the sideview of lineup)
            modifier = "%sgroup_%s;"%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            #col = col.split("_")[1]
        elif col.startswith(tuple(descriptor_names_show_lineup)):
            modifier = "%slineup_show;"%modifier # this modifier tells lineup that the column should be initially viewed
            modifier = "%sgroup_%s;"%(modifier, col.split("_")[0]) # this modifier tells lineup that the columns belong to a certain group
            #col = col.split("_")[1]
        else:
            modifier = "%slineup_show;"%modifier # this modifier tells lineup that the column should be initially viewed
            
        if col == smiles_col:
            modifier = "%ssmiles_to_img;"%modifier # this modifier tells lineup that a structure image of this smiles string should be loaded
            
        
        new_cols.append("%s[%s]"%(col,modifier[0:-1])) # remove the last semicolon
        
    frame.columns = new_cols

    if not has_fingerprint: # when there are no morgan fingerprints included in the dataset, calculate them now
        fps = pd.DataFrame([list(AllChem.GetMorganFingerprintAsBitVect(mol,5,nBits=256)) for mol in molecule_df])
        fps.columns = ["fingerprint_%s[slineup_none;group_fingerprint]"%fp for fp in fps] 
        frame = frame.join(fps)

    csv_buffer = StringIO()
    frame.to_csv(csv_buffer, index=False)
    
    return csv_buffer.getvalue()


from bottle import static_file
from rdkit.Chem import Draw
import urllib
@app.route('/get_mol_img/<smiles>', method=['GET'])
def smiles_to_img(smiles):
    smiles = urllib.parse.unquote(smiles)
    m = Chem.MolFromSmiles(smiles)
    pil_img = Draw.MolToImage(m)

    if os.path.exists("mol_temp.jpg"):
        os.remove("mol_temp.jpg")
    pil_img.save('mol_temp.jpg')

    return static_file('mol_temp.jpg', root="./")

def smiles_to_base64(smiles):
    m = Chem.MolFromSmiles(smiles)
    return mol_to_base64(m)

def mol_to_base64(m):
    pil_img = Draw.MolToImage(m)

    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    buffered.close()
    return img_str.decode("utf-8")

from io import BytesIO
from PIL import Image
def mol_to_base64_highlight(mol, patt):
    d = Chem.Draw.rdMolDraw2D.MolDraw2DCairo(200, 200)
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
    return img_str.decode("utf-8")

from rdkit.Chem import Draw
import base64
from io import BytesIO
@app.route('/get_mol_img', method=['OPTIONS', 'POST'])
def smiles_to_img_post():
    if request.method == 'POST':
        smiles = request.forms.get("smiles")
        return smiles_to_base64(smiles)
    else:
        return {}


from rdkit import Chem
from rdkit.Chem import TemplateAlign
@app.route('/get_mol_imgs', method=['OPTIONS', 'POST'])
def smiles_list_to_imgs():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list")

        if len(smiles_list) == 0:
            return {}
        if len(smiles_list) == 1:
            return {"img_lst": [smiles_to_base64(smiles_list[0])]}

        mol_lst = [Chem.MolFromSmiles(smiles) for smiles in smiles_list]
        res=Chem.rdFMCS.FindMCS(mol_lst, ringMatchesRingOnly=True) # there are different settings possible here
        patt = res.queryMol
        TemplateAlign.rdDepictor.Compute2DCoords(patt)

        img_lst = []
        for mol in mol_lst:
            TemplateAlign.rdDepictor.Compute2DCoords(mol)
            TemplateAlign.AlignMolToTemplate2D(mol,patt,clearConfs=True)
            img_lst.append(mol_to_base64_highlight(mol, patt))

        return {"img_lst": img_lst}
    else:
        return {}


from rdkit.Chem import rdFMCS
@app.route('/get_common_mol_img', method=['OPTIONS', 'POST'])
def smiles_list_to_common_substructure_img():
    if request.method == 'POST':
        smiles_list = request.forms.getall("smiles_list")
        if len(smiles_list) == 0:
            return {}
        if len(smiles_list) == 1:
            return smiles_to_base64(smiles_list[0])

        mol_list = [ Chem.MolFromSmiles(smiles) for smiles in smiles_list ]
        res = rdFMCS.FindMCS(mol_list, matchValences=True, ringMatchesRingOnly=True)
        m = res.queryMol
        pil_img = Draw.MolToImage(m)

        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        return img_str.decode("utf-8")
    else:
        return {}
        
        
@app.route('/', method=["GET"])
def home():
    print("ok python")
    return "ok3"

app.install(EnableCors())

#app.run(port=8080) # not working for docker and apparently not needed


# run(host='localhost', port=8080, debug=True, reloader=True)
run(host='0.0.0.0', port=8080) # use for docker
