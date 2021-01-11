// CONSTANTS

export const BASE_URL = 'http://127.0.0.1:8080'; // for local
// export const BASE_URL = ''; // for AWS
// export const BASE_URL = 'https://chemvis.caleydoapp.org'; // for netlify
// export const BASE_URL = 'http://127.0.0.1:5000';
// export const BASE_URL = 'http://caleydoapp.org:32819';


var smiles_cache = {}
async function get_smiles_cache(smiles:string){
    return smiles_cache[smiles];
}

export async function get_structure_from_smiles(smiles:string) {
    if(smiles_cache[smiles]){ //already downloaded this image -> saved in smiles cache
        return get_smiles_cache(smiles);
    }

    const formData = new FormData();
    formData.append('smiles', smiles);
    return fetch(BASE_URL+'/get_mol_img', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        smiles_cache[smiles] = data;
        return data;
    })
    .catch(error => {
        console.error(error)
    });
}

export async function get_structures_from_smiles_list(formData:FormData){
    return fetch(BASE_URL+'/get_mol_imgs', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .catch(error => {
        console.error(error)
    });
}


export async function get_mcs_from_smiles_list(formData:FormData) {
    return fetch(BASE_URL+'/get_common_mol_img', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .catch(error => {
        console.error(error)
    });
    
}


export async function upload_sdf_file(file){
    // upload the sdf file to the server
    // the response is a unique filename that can be used to make further requests
    const formData_file = new FormData();
    formData_file.append('myFile', file);

    return fetch(BASE_URL+'/upload_sdf', {
        method: 'POST',
        body: formData_file,
    })
    .then(response => response.json())
    .catch(error => {
        console.error(error);
    });
}


export async function calculate_hdbscan_clusters(X){
    return fetch(BASE_URL+'/segmentation', {
        method: 'POST',
        body: JSON.stringify(X)
    }).then(response => response.json());
}
