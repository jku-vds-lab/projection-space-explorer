import { DatasetType } from "../Data/DatasetType"
import { IVectUtil, IVect } from "../Data/Vect"
import { Loader } from "./Loader"
import { CSVLoader } from "./CSVLoader"
import * as backend_utils from "../../../utils/backend-connect";
import { trackPromise } from "react-promise-tracker";

var d3v5 = require('d3')

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return IVectUtil.create(vector)
    })
}

export class SDFLoader implements Loader {
    vectors: IVect[]
    datasetType: DatasetType

    loading_area = "global_loading_indicator";

    constructor() {
    }
    resolvePath(entry: any, finished: any, cancellablePromise?, modifiers?: string, abort_controller?) {
        if(entry.uploaded){ // use file that is already uploaded to backend
            localStorage.setItem("unique_filename", entry.path);
            this.loadCSV(finished, entry, cancellablePromise, modifiers, abort_controller);
        }else{
            trackPromise(
                fetch(entry.path, {signal: abort_controller?.signal}).then(response => response.blob())
                .then(result => this.resolveContent(result, finished, cancellablePromise, modifiers, abort_controller))
                .catch(error => {console.log(error)})
            , this.loading_area);
        }
    }

    
    resolveContent(file, finished, cancellablePromise?, modifiers?: string, controller?) {
        const promise = cancellablePromise ? cancellablePromise(backend_utils.upload_sdf_file(file, controller), controller) : backend_utils.upload_sdf_file(file, controller)
        trackPromise(
            promise.then(() => {
                this.loadCSV(finished, { display: "", type: this.datasetType, path: file.name }, cancellablePromise, modifiers, controller);
            })
            .catch(error => {
                console.log(error);
            })
        , this.loading_area);

    }

    loadCSV(finished, entry, cancellablePromise?, modifiers?:string, controller?){
        // request the server to return a csv file using the unique filename
        let path = backend_utils.BASE_URL+'/get_csv/'
        const filename = localStorage.getItem("unique_filename")
        if(filename !== undefined){
            path += filename;
        }
        path += "/";
        path += modifiers;
        const promise = cancellablePromise ? cancellablePromise(d3v5.csv(path, {credentials: backend_utils.CREDENTIALS, signal: controller?.signal}), controller) : d3v5.csv(path, {credentials: backend_utils.CREDENTIALS, signal: controller?.signal})
        trackPromise(
            promise.then(vectors => {
                this.vectors = convertFromCSV(vectors);
                this.datasetType = DatasetType.Chem;
                new CSVLoader().resolve(finished, this.vectors, this.datasetType, entry);
            })
            .catch(error => {console.log(error)})
        , this.loading_area);
    }
    

}