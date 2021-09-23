/**
 * Directed graph library for javascript.
 */

import { ICluster, TypedObject } from "./Data/Cluster"
import { Dataset } from "./Data/Dataset"
import { ObjectTypes } from "./Data/ObjectType"
import { IVect } from "./Data/Vect"


/**
 * Graph class which holds the nodes and edges of the graph.
 */
export class Graph {
    nodes: any
    edges: any

    constructor(nodes, edges) {
        this.nodes = nodes
        this.edges = edges
    }
}

/**
 * Node class holding the vectors that are in this node.
 */
export class Node {
    vectors: IVect[]

    constructor(vectors) {
        this.vectors = vectors
    }
}

/**
 * Edge class that is a connection between 2 nodes.
 */
export class Edge implements TypedObject {
    source: ICluster
    destination: ICluster
    bundle: number[]
    name: string

    constructor(source, destination, bundle) {
        this.source = source
        this.destination = destination
        this.bundle = bundle
        this.objectType = ObjectTypes.Edge
    }
    objectType: string
}



/**
 * Performs the graphing algorithm.
 * @param {*} clusters 
 * @param {*} vectors 
 */
export function graphLayout(dataset: Dataset, clusters: ICluster[]) {
    var edges: Edge[] = []

    // For each cluster,
    Object.keys(clusters).forEach(srcKey => {
        var srcCluster = clusters[srcKey] as ICluster
        Object.keys(clusters).forEach(dstKey => {
            var dstCluster = clusters[dstKey] as ICluster
            if (dstCluster != srcCluster) {
                var bundle = []

                // For each vector in source cluster, check if the direct ancestor is in the destination cluster
                srcCluster.refactored.map(i => dataset.vectors[i]).forEach(srcVec => {
                    if (dstCluster.refactored.map(i => dataset.vectors[i]).find(dstVec => srcVec.line == dstVec.line && srcVec.__meta__.sequenceIndex + 1 == dstVec.__meta__.sequenceIndex)) {
                        bundle.push(srcVec.line)
                    }
                })

                if (bundle.length > 10) {
                    var edge = new Edge(srcCluster, dstCluster, [...new Set(bundle)])
                    edges.push(edge)
                }
            }
        })

    })

    return [edges]
}