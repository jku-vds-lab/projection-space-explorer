/**
 * Directed graph library for javascript.
 */

import Cluster from "./Data/Cluster"
import { Vect } from "./Data/Vect"


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
    vectors: Vect[]

    constructor(vectors) {
        this.vectors = vectors
    }
}

/**
 * Edge class that is a connection between 2 nodes.
 */
export class Edge {
    source: Cluster
    destination: Cluster
    bundle: number[]
    name: string

    constructor(source, destination, bundle) {
        this.source = source
        this.destination = destination
        this.bundle = bundle
    }
}



/**
 * Performs the graphing algorithm.
 * @param {*} clusters 
 * @param {*} vectors 
 */
export function graphLayout(clusters) {
    var edges: Edge[] = []

    // For each cluster,
    Object.keys(clusters).forEach(srcKey => {
        var srcCluster = clusters[srcKey]
        Object.keys(clusters).forEach(dstKey => {
            var dstCluster = clusters[dstKey]
            if (dstCluster != srcCluster) {
                var bundle = []

                // For each vector in source cluster, check if the direct ancestor is in the destination cluster
                srcCluster.vectors.forEach(srcVec => {
                    if (dstCluster.vectors.find(dstVec => srcVec.view.segment.lineKey == dstVec.view.segment.lineKey && srcVec.view.sequenceIndex + 1 == dstVec.view.sequenceIndex)) {
                        bundle.push(srcVec.view.segment.lineKey)
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