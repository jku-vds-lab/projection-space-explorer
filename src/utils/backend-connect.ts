import { None } from "vega";
// CONSTANTS

export const CREDENTIALS = 'include'; // for AWS/docker
// export const CREDENTIALS = 'omit'; // for netlify/local

// export const BASE_URL = 'https://chemvis.caleydoapp.org'; // for netlify
// export const BASE_URL = 'http://127.0.0.1:8080'; // for local
export const BASE_URL = ''; // for AWS/docker



var smiles_cache = {}
var smiles_highlight_cache = {}

function handleSmilesCache(smiles:string, highlight=false){
    //already downloaded this image -> saved in smiles cache
    if(highlight){
        return smiles_highlight_cache[smiles];
    }else{
        return smiles_cache[smiles];
    }

}

function setSmilesCache(smiles, highlight=false, data){
    if(highlight)
        smiles_highlight_cache[smiles] = data;
    else
        smiles_cache[smiles] = data;
}

async function async_cache(cached_data){
    return cached_data;
}

function handle_errors(response){
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}


export async function delete_file(filename){
    let path = BASE_URL+'/delete_file/' + filename;
    
    return fetch(path, {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .catch(error => {
        console.error(error)
    });
}

export async function get_uploaded_files(){
    
    let path = BASE_URL+'/get_uploaded_files_list';
    
    return fetch(path, {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .catch(error => {
        console.error(error)
    });
}


export async function get_structure_from_smiles(smiles:string, highlight=false) {
    const cached_data = handleSmilesCache(smiles, highlight)
    if(cached_data){
        return async_cache(cached_data);
    }

    const formData = new FormData();
    formData.append('smiles', smiles);
    if(localStorage.getItem("unique_filename"))
        formData.append('filename', localStorage.getItem("unique_filename"));

    let path = BASE_URL+'/get_mol_img';
    if(highlight){
        path += "/highlight";
    }

    return fetch(path, {
        method: 'POST',
        body: formData,
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.text())
    .then(data => {
        setSmilesCache(smiles, highlight, data);
        return data;
    })
    .catch(error => {
        console.error(error)
    });
}

export async function get_structures_from_smiles_list(formData:FormData){
    if(localStorage.getItem("unique_filename"))
        formData.append('filename', localStorage.getItem("unique_filename"));

    return fetch(BASE_URL+'/get_mol_imgs', {
        method: 'POST',
        body: formData,
        credentials: CREDENTIALS
    })
    .then(handle_errors)
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
    .then(handle_errors)
    .then(response => response.text())
    .catch(error => {
        console.error(error)
    });
    
}

export async function get_substructure_count(smiles_list, filter) {
    const formData = new FormData();
    formData.append('smiles_list', smiles_list);
    formData.append('filter_smiles', filter);
    return fetch(BASE_URL+'/get_substructure_count', {
        method: 'POST',
        body: formData,
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(data => {
        if(Object.keys(data).includes("substructure_counts"))
            return data["substructure_counts"];
        else 
            throw Error("Backend responded with error: " + data["error"]);
    })
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
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("unique_filename", data["unique_filename"]);
    })
    .catch(error => {
        console.error(error);
    });
}


export async function get_representation_list(){

    let path = BASE_URL+'/get_atom_rep_list';
    if(localStorage.getItem("unique_filename"))
        path += "/" + localStorage.getItem("unique_filename");


    return fetch(path, {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.json())
    .catch(error => {
        console.error(error)
    });
}





export async function calculate_hdbscan_clusters(X){
    return fetch(BASE_URL+'/segmentation', {
        method: 'POST',
        body: JSON.stringify(X)

    })
    .then(handle_errors)
    .then(response => response.json());
}




export async function test() {
    return fetch(BASE_URL+'/test', {
        method: 'GET',
        credentials: CREDENTIALS
    })
    .then(handle_errors)
    .then(response => response.text());//.text());
}