"use strict";
// CONSTANTS
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// export const CREDENTIALS = 'include'; // for AWS/docker
exports.CREDENTIALS = 'omit'; // for netlify/local
exports.BASE_URL = 'https://cime.caleydoapp.org'; // for netlify
// export const BASE_URL = 'http://127.0.0.1:8080'; // for local
// export const BASE_URL = ''; // for AWS/docker
function handle_errors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
function handle_errors_json(data) {
    if (Object.keys(data).includes("error")) {
        alert(data["error"]);
    }
    return data;
}
function calculate_hdbscan_clusters(X, min_cluster_size, min_cluster_samples, allow_single_cluster) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append('min_cluster_size', min_cluster_size);
        formData.append('min_cluster_samples', min_cluster_samples);
        formData.append('allow_single_cluster', allow_single_cluster);
        formData.append('X', X);
        return fetch(exports.BASE_URL + '/segmentation', {
            method: 'POST',
            body: formData
        })
            .then(handle_errors)
            .then(response => response.json())
            .then(handle_errors_json)
            .catch(error => {
            alert("error when calculating clusters");
            console.log(error);
        });
    });
}
exports.calculate_hdbscan_clusters = calculate_hdbscan_clusters;
