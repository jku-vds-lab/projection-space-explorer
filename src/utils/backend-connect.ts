
export const BASE_URL = 'http://127.0.0.1:8080';
// export const BASE_URL = 'http://127.0.0.1:5000';
// export const BASE_URL = 'http://caleydoapp.org:32819';

export async function get_structure_from_smiles(smiles:string) {
    const formData = new FormData();
    formData.append('smiles', smiles);
    return fetch(BASE_URL+'/get_mol_img', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
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

