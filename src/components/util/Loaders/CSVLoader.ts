import { Vect, Preprocessor, Dataset, InferCategory, DatasetType } from "../datasetselector"
import { Loader } from "./Loader"


var d3v5 = require('d3')

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return new Vect(vector)
    })
}

export class CSVLoader implements Loader {
    vectors: Vect[]
    datasetType: DatasetType

    constructor() {
    }

    resolvePath(entry, finished) {
        d3v5.csv(entry.path).then(vectors => {
            this.vectors = convertFromCSV(vectors)
            this.datasetType = entry.type

            this.resolve(finished)
        })
    }

    parseRange(str) {
        var range = str.match(/-?\d+\.?\d*/g)
        return { min: range[0], max: range[1], inferred: true }
    }

    resolveContent(content, finished) {
        this.vectors = convertFromCSV(d3v5.csvParse(content))
        this.datasetType = new InferCategory(this.vectors).inferType()

        this.resolve(finished)
    }




    resolve(finished) {
        var header = Object.keys(this.vectors[0])
        var ranges = header.reduce((map, value) => {
            var matches = value.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d*\]/)

            if (matches != null) {
                var cutHeader = value.substring(0, value.length - matches[0].length)
                this.vectors.forEach(vector => {
                    vector[cutHeader] = vector[value]
                    delete vector[value]
                })
                header[header.indexOf(value)] = cutHeader
                map[cutHeader] = this.parseRange(matches[0])
            }

            return map
        }, {})

        var preselection = Object.keys(header.reduce((map, value) => {
            if (value.startsWith('*')) {
                var cutHeader = value.substring(1)
                this.vectors.forEach(vector => {
                    vector[cutHeader] = vector[value]
                    delete vector[value]
                })
                header[header.indexOf(value)] = cutHeader
                map[cutHeader] = 0
            }

            return map
        }, {}))

        if (preselection == null || preselection.length == 0) {
            preselection = null
        }

        ranges = new Preprocessor(this.vectors).preprocess(ranges)

        finished(new Dataset(this.vectors, ranges, preselection, { type: this.datasetType }), new InferCategory(this.vectors).load(ranges))
    }
}