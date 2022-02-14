// CONSTANTS

// export const CREDENTIALS = 'include'; // for AWS/docker
export const CREDENTIALS = 'omit'; // for netlify/local

export const BASE_URL = 'https://cime.caleydoapp.org'; // for netlify
// export const BASE_URL = 'http://127.0.0.1:8080'; // for local
// export const BASE_URL = ''; // for AWS/docker

function handle_errors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
function handle_errors_json(data) {
  if (Object.keys(data).includes('error')) {
    alert(data.error);
  }
  return data;
}

export async function calculate_hdbscan_clusters(X, min_cluster_size, min_cluster_samples, allow_single_cluster) {
  const formData = new FormData();
  formData.append('min_cluster_size', min_cluster_size);
  formData.append('min_cluster_samples', min_cluster_samples);
  formData.append('allow_single_cluster', allow_single_cluster);
  formData.append('X', X);
  return fetch(`${BASE_URL}/segmentation`, {
    method: 'POST',
    body: formData,
  })
    .then(handle_errors)
    .then((response) => response.json())
    .then(handle_errors_json)
    .catch((error) => {
      alert('error when calculating clusters');
      console.log(error);
    });
}
