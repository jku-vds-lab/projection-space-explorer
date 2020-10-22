import { Vect, DatasetDatabase, Preprocessor, getSegs, Dataset, InferCategory, DatasetType, FeatureType } from "../../components/util/datasetselector"
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

    getFeatureType(x) {
        if (typeof x  === "number" || !isNaN(Number(x))) {
            return 'number'
        } else if (""+new Date(x) !== "Invalid Date") {
            return 'date'
        } else {
            return 'arbitrary'
        }
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

        // infer for each feature whether it contains numeric, date, or arbitrary values
        var contains_number = {}
        var contains_date = {}
        var contains_arbitrary = {}
        this.vectors.forEach((r) => {
            header.forEach(f => {
                const type = this.getFeatureType(r[f])
                if (type === 'number') {
                    contains_number[f] = true
                } else if (type === 'date') {
                    contains_date[f] = true
                } else {
                    contains_arbitrary[f] = true
                }
            })

        })
        var types = {}
        // decide the type of each feature - categorical/quantitative/date
        header.forEach((f) => {
            if (contains_number[f] && !contains_date[f] && !contains_arbitrary[f]) {
                // only numbers -> quantitative type
                // (no way to tell if a feature of only numbers should be categorical, even if it is all integers)
                types[f] = FeatureType.Quantitative
            } else if (!contains_number[f] && contains_date[f] && !contains_arbitrary[f]) {
                // only date -> date type
                types[f] = FeatureType.Date
            } else {
                // otherwise categorical
                types[f] = FeatureType.Categorical
            }
        })

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

        finished(new Dataset(this.vectors, ranges, preselection, { type: this.datasetType }, types), new InferCategory(this.vectors).load(ranges))
    }
}