import { Loader } from "./Loader";
import * as hdf5 from 'jsfive';
import { Vect, Preprocessor, Dataset, InferCategory, DatasetType } from "../../components/util/datasetselector";
import Cluster from "../../components/util/Cluster";
import { Edge } from "../../components/util/graphs";

export class HDF5Loader implements Loader {
    vectors: Vect[]
    datasetType: DatasetType

    resolvePath(entry: any, finished: any) {
        fetch(entry.path)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.resolve(data, finished, entry.type)
            });
    }

    resolveContent(content: any, finished: any) {
        let file = JSON.parse(content)
        this.resolve(file, finished, null)
    }


    resolve(content, finished, datasetType) {
        let fileSamples = content.samples[0]

        this.vectors = []
        fileSamples.data.forEach(row => {
            let data = {}
            fileSamples.columns.forEach((column, ci) => {
                data[column] = row[ci]
            })
            this.vectors.push(new Vect(data))

        })

        this.datasetType = datasetType ?  datasetType : new InferCategory(this.vectors).inferType()
        let ranges = {}

        let clusters: Cluster[] = []
        content.clusters[0].data.forEach(row => {
            let points = []
            row[1].forEach(i => {
                points.push(this.vectors[i])
            })
            let cluster = new Cluster(points)
            cluster.label = row[0]
            clusters.push(cluster)
        })
        
        let edges = []
        content.edges[0].data.forEach(row => {
            edges.push(new Edge(clusters.find(cluster => cluster.label == row[1]), clusters.find(cluster => cluster.label == row[2]), null))
        })
        
        let preselection = content.preselection[0].data.flat()

        ranges = new Preprocessor(this.vectors).preprocess(ranges)

        let dataset = new Dataset(this.vectors, ranges, preselection, { type: this.datasetType })
        dataset.clusters = clusters
        dataset.clusterEdges = edges
        console.log(dataset.clusterEdges)

        finished(dataset, new InferCategory(this.vectors).load(ranges))
    }
}