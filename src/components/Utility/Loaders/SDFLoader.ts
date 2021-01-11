import { DatasetType } from "../Data/DatasetType"
import { Vect } from "../Data/Vect"
import { Loader } from "./Loader"
import { CSVLoader } from "./CSVLoader"
import * as backend_utils from "../../../utils/backend-connect";
// import sdf from "../../../../datasets/chemvis/test.sdf";

var d3v5 = require('d3')

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return new Vect(vector)
    })
}

export class SDFLoader implements Loader {
    vectors: Vect[]
    datasetType: DatasetType

    constructor() {
    }
    resolvePath(entry: any, finished: any, modifiers?: string) {
        fetch(entry.path).then(response => response.blob())
        .then(result => this.resolveContent(result, finished, modifiers));
    }

    
    resolveContent(file, finished, modifiers?: string) {

        backend_utils.upload_sdf_file(file).then(() => {
            // request the server to return a csv file using the unique filename
            const filename = sessionStorage.getItem("unique_filename")
            let path = backend_utils.BASE_URL+'/get_csv/'
            if(filename){
                path += filename;
                path += "/";
            }
            path += modifiers;

            d3v5.csv(path, {credentials: "include"}).then(vectors => {
                this.vectors = convertFromCSV(vectors);
                this.datasetType = DatasetType.Chem;
                new CSVLoader().resolve(finished, this.vectors, this.datasetType, { display: "", type: this.datasetType, path: "" });
            });
        })
        .catch(error => {
            console.error(error);
        });

    }

    

}