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
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors

app = bottle.app()


@app.route('/', method=['OPTIONS', 'GET'])
def index():
    return "test"

import os
@app.route('/get_csv', method=['POST'])
def sdf_to_csv():
    fileUpload = request.files.get("myFile")

    if os.path.exists("temp.sdf"):
        os.remove("temp.sdf")
    fileUpload.save("temp.sdf")

    suppl = Chem.SDMolSupplier("temp.sdf")

    for mol in suppl:
        print(Chem.MolToSmiles(mol))

    return {
        'result': 'ok'
    }

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


app.install(EnableCors())

app.run(port=8080)

run(host='localhost', port=8080)
