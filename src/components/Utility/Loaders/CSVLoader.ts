import { FeatureType } from "../../../model/FeatureType"
import { DatasetType } from "../../../model/DatasetType"
import { AVector, IVector } from "../../../model/Vector"
import { InferCategory } from "../Data/InferCategory"
import { Preprocessor } from "../Data/Preprocessor"
import { Dataset, DefaultFeatureLabel } from "../../../model/Dataset"
import { Loader } from "./Loader"
import { ICluster } from "../../../model/Cluster"
import { ObjectTypes } from "../../../model/ObjectType"
import WorkerCluster from "../../workers/cluster.worker";
import * as d3v5 from 'd3v5';
import { DatasetEntry } from "../../../model/DatasetEntry"

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return AVector.create(vector)
    })
}

export class CSVLoader implements Loader {
    vectors: IVector[]
    datasetType: DatasetType

    constructor() {
    }

    resolvePath(entry: DatasetEntry, finished) {
        d3v5.csv(entry.path).then(vectors => {
            this.vectors = convertFromCSV(vectors)
            this.datasetType = entry.type

            this.resolve(finished, this.vectors, this.datasetType, entry)
        })
    }

    parseRange(str) {
        var range = str.match(/-?\d+\.?\d*/g)
        return { min: range[0], max: range[1], inferred: true }
    }


    resolveContent(content, finished) {
        const vectors = convertFromCSV(d3v5.csvParse(content))
        this.resolveVectors(vectors, finished)
    }

    resolveVectors(vectors, finished) {
        this.vectors = convertFromCSV(vectors)
        this.datasetType = new InferCategory(this.vectors).inferType()

        this.resolve(finished, this.vectors, this.datasetType, { display: "", type: this.datasetType, path: "" })
    }

    getFeatureType(x) {
        if (typeof x === "number" || !isNaN(Number(x))) {
            return 'number'
        } else if ("" + new Date(x) !== "Invalid Date") {
            return 'date'
        } else {
            return 'arbitrary'
        }
    }


    getClusters(vectors: IVector[], callback) {
        let worker = new WorkerCluster()

        worker.onmessage = (e) => {
            // Point clustering
            let clusters = new Array<ICluster>()
            Object.keys(e.data).forEach(k => {
                let t = e.data[k]
                clusters.push({
                    objectType: ObjectTypes.Cluster,
                    indices: t.points.map(i => i.meshIndex),
                    hull: t.hull,
                    triangulation: t.triangulation,
                    label: k
                })
            })

            callback(clusters)
        }

        worker.postMessage({
            type: 'extract',
            message: vectors.map(vector => [vector.x, vector.y, vector.groupLabel])
        })
    }


    async resolve(finished, vectors, datasetType, entry: DatasetEntry) {
        var header = Object.keys(vectors[0])

        var ranges = header.reduce((map, value) => {
            var matches = value.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d* *;? *.*\]/)
            if (matches != null) {
                var cutHeader = value.substring(0, value.length - matches[0].length)
                vectors.forEach(vector => {
                    vector[cutHeader] = vector[value]
                    delete vector[value]
                })
                // header[header.indexOf(value)] = cutHeader
                map[cutHeader] = this.parseRange(matches[0])
            }
            return map
        }, {})

        // Check for JSON header inside column, store it as key/value pair
        var metaInformation = header.reduce((map, value) => {
            let json = value.match(/[{].*[}]/)
            if (json != null) {
                let cutHeader = value.substring(0, value.length - json[0].length)

                vectors.forEach(vector => {
                    vector[cutHeader] = vector[value]
                    delete vector[value]
                })
                map[cutHeader] = JSON.parse(json[0])
            } else {
                map[value] = {"featureLabel": DefaultFeatureLabel}
            }
            return map
        }, {})

        let index = 0;
        var types = {}
        // decide the type of each feature - categorical/quantitative/date
        header.forEach((f) => {
            const current_key = Object.keys(metaInformation)[index]
            const col_meta = metaInformation[current_key];
            if(col_meta?.dtype){
                switch(col_meta.dtype){
                    case "numerical":
                        types[current_key] = FeatureType.Quantitative;
                        break;
                    case "date":
                        types[current_key] = FeatureType.Date;
                        break;
                    case "categorical":
                        types[current_key] = FeatureType.Categorical;
                        break;
                    case "string":
                        types[current_key] = FeatureType.String;
                        break;
                    default:
                        types[current_key] = FeatureType.String;
                        break;
                }
            }else{
                // infer for each feature whether it contains numeric, date, or arbitrary values
                var contains_number = {}
                var contains_date = {}
                var contains_arbitrary = {}
                vectors.forEach((r) => {
                    const type = this.getFeatureType(r[current_key])
                    if (type === 'number') {
                        contains_number[current_key] = true
                    } else if (type === 'date') {
                        contains_date[current_key] = true
                    } else {
                        contains_arbitrary[current_key] = true
                    }
                })
                
                if (contains_number[current_key] && !contains_date[current_key] && !contains_arbitrary[current_key]) {
                    // only numbers -> quantitative type
                    types[current_key] = FeatureType.Quantitative
                } else if (!contains_number[current_key] && contains_date[current_key] && !contains_arbitrary[current_key]) {
                    // only date -> date type
                    types[current_key] = FeatureType.Date
                } else {
                    // otherwise categorical
                    types[current_key] = FeatureType.Categorical
                }
            }
            index++;
        })
        

        // replace date features by their numeric timestamp equivalent
        // and fix all quantitative features to be numbers
        // list of filter headers for date
        const dateFeatures = []
        const quantFeatures = []
        for (var key in types) {
            if (types[key] === FeatureType.Date) {
                dateFeatures.push(key)
            } else if (types[key] === FeatureType.Quantitative) {
                quantFeatures.push(key)
            }
        }
        // for all rows
        for (var i = 0; i < vectors.length; i++) {
            // for all date features f
            dateFeatures.forEach(f => {
                // overwrite sample with its timestamp
                vectors[i][f] = Date.parse(vectors[i][f])
            });
            quantFeatures.forEach(f => {
                // overwrite sample with its timestamp
                vectors[i][f] = +vectors[i][f]
            });
        }

        ranges = new Preprocessor(vectors).preprocess(ranges)
        
        let dataset = new Dataset(vectors, ranges, { type: datasetType, path: entry.path }, types, metaInformation)
        

        this.getClusters(vectors, clusters => {
            dataset.clusters = clusters

            // Reset cluster label after extraction
            dataset.vectors.forEach(vector => {
                vector.groupLabel = []
            })

            dataset.categories = dataset.extractEncodingFeatures(ranges)

            finished(dataset)
        })
    }
}