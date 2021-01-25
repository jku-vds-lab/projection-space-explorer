import { DatasetType } from "../Data/DatasetType"
import { Vect } from "../Data/Vect"
import { Loader } from "./Loader"
import { CSVLoader } from "./CSVLoader"
import * as backend_utils from "../../../utils/backend-connect";
import { trackPromise } from "react-promise-tracker";
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
        if(entry.uploaded){ // use file that is already uploaded to backend
            localStorage.setItem("unique_filename", entry.path);
            this.loadCSV(finished, modifiers);
        }else{
            trackPromise(
                fetch(entry.path).then(response => response.blob())
                .then(result => this.resolveContent(result, finished, modifiers))
            );
        }
    }

    
    resolveContent(file, finished, modifiers?: string) {

        trackPromise(
            backend_utils.upload_sdf_file(file).then(() => {
                this.loadCSV(finished, modifiers);
            })
            .catch(error => {
                console.error(error);
            })
        );

    }

    loadCSV(finished, modifiers?:string){
        // request the server to return a csv file using the unique filename
        let path = backend_utils.BASE_URL+'/get_csv/'
        const filename = localStorage.getItem("unique_filename")
        if(filename !== undefined){
            path += filename;
        }
        path += "/";
        path += modifiers;
        trackPromise(
            d3v5.csv(path, {credentials: backend_utils.CREDENTIALS}).then(vectors => {
                this.vectors = convertFromCSV(vectors);
                this.datasetType = DatasetType.Chem;
                new CSVLoader().resolve(finished, this.vectors, this.datasetType, { display: "", type: this.datasetType, path: "" });
            })
        );
    }
    

}