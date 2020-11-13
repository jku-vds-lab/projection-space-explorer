import { Loader } from "./Loader";
import * as hdf5 from 'jsfive';
import { Vect, Preprocessor, Dataset, InferCategory, DatasetType, FeatureType } from "../datasetselector";
import Cluster from "../Cluster";
import { Edge } from "../graphs";

export class JSONLoader implements Loader {
    vectors: Vect[]
    datasetType: DatasetType

    resolvePath(entry: any, finished: any) {
        throw new Error("Method not implemented.");
    }

    resolveContent(content: any, finished: any) {
        let file = JSON.parse(content)
        this.resolve(file, finished, null, { path: "" })
    }

    inferRangeForAttribute(key: string) {

        let values = this.vectors.map(sample => sample[key])
        let numeric = true
        let min = Number.MAX_SAFE_INTEGER
        let max = Number.MIN_SAFE_INTEGER

        values.forEach(value => {
            if (isNaN(value)) {
                numeric = false
            } else if (numeric) {
                if (value < min) {
                    min = value
                } else if (value > max) {
                    max = value
                }
            }
        })

        return numeric ? { min: min, max: max } : null
    }

    parseRange(str) {
        var range = str.match(/-?\d+\.?\d*/g)
        return { min: parseFloat(range[0]), max: parseFloat(range[1]), inferred: true }
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

    async resolve(content, finished, datasetType, entry) {
        let fileSamples = content.samples[0]

        let ranges = {}

        // Parse predefined ranges
        fileSamples.columns.forEach((column, ci) => {
            var matches = column.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d*\]/)
            if (matches) {
                let prefix = column.substring(0, column.length - matches[0].length)

                fileSamples.columns[ci] = prefix
                ranges[prefix] = this.parseRange(matches[0])
            }
        })

        this.vectors = []
        fileSamples.data.forEach(row => {
            let data = {}
            fileSamples.columns.forEach((column, ci) => {
                data[column] = row[ci]
            })
            this.vectors.push(new Vect(data))
        })

        var header = Object.keys(this.vectors[0])
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
        for (var i = 0; i < this.vectors.length; i++) {
            // for all date features f
            dateFeatures.forEach(f => {
                // overwrite sample with its timestamp
                this.vectors[i][f] = Date.parse(this.vectors[i][f])
            });
            quantFeatures.forEach(f => {
                // overwrite sample with its timestamp
                this.vectors[i][f] = +this.vectors[i][f]
            });
        }

        this.datasetType = datasetType ? datasetType : new InferCategory(this.vectors).inferType()

        let clusters: Cluster[] = []
        content.clusters[0].data.forEach(row => {
            let points = []
            row[1].forEach(i => {
                points.push(this.vectors[i])
            })
            let cluster = new Cluster(points)

            cluster.vectors = points
            cluster.name = row[2]
            cluster.label = row[0]
            clusters.push(cluster)
        })

        let edges = []
        content.edges[0].data.forEach(row => {
            edges.push(new Edge(clusters.find(cluster => cluster.label == row[1]), clusters.find(cluster => cluster.label == row[2]), null))
        })

        let preselection = null
        if ('preselection' in content) {
            preselection = content.preselection[0].data.flat()
        }


        ranges = new Preprocessor(this.vectors).preprocess(ranges)

        let dataset = new Dataset(this.vectors, ranges, preselection, { type: this.datasetType, path: entry.path }, types)
        dataset.clusters = clusters
        dataset.clusterEdges = edges

        finished(dataset, new InferCategory(this.vectors).load(ranges))
    }
}