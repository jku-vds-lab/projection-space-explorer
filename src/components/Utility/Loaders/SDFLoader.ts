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
    resolvePath(entry: any, finished: any) {
        fetch(entry.path).then(response => response.blob())
        .then(result => this.resolveContent(result, finished));
    }

    
    resolveContent(file, finished) {
        backend_utils.upload_sdf_file(file).then(data => {
            // request the server to return a csv file using the unique filename
            d3v5.csv(backend_utils.BASE_URL+'/get_csv/' + data["unique_filename"]).then(vectors => {
                this.vectors = convertFromCSV(vectors);
                this.datasetType = DatasetType.Chem;
                new CSVLoader().resolve(finished, this.vectors, this.datasetType, { display: "", type: this.datasetType, path: data["unique_filename"] });
            });
        })
        .catch(error => {
            console.error(error);
        });

    }

    

}