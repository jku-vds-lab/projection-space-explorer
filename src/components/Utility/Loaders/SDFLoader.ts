import { FeatureType } from "../Data/FeatureType"
import { DatasetType } from "../Data/DatasetType"
import { Vect } from "../Data/Vect"
import { InferCategory } from "../Data/InferCategory"
import { Preprocessor } from "../Data/Preprocessor"
import { Dataset } from "../Data/Dataset"
import { Loader } from "./Loader"
import { DatasetEntry } from "../Data/DatasetDatabase"


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
        throw new Error("Method not implemented.")
    }

    
    resolveContent(file, finished) {
              
        const formData = new FormData()
        formData.append('myFile', file)

        fetch('http://127.0.0.1:8080/get_csv', {
            method: 'POST',
            body: formData,
        })
        .then(response => console.log("response", response.json()))
        .then(data => {
            console.log("data", data)
        })
        .catch(error => {
            console.error(error)
        })
        // this.vectors = convertFromCSV(d3v5.csvParse(content))
        // this.datasetType = new InferCategory(this.vectors).inferType()

    }

}