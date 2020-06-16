/**
 * Directed graph library for javascript.
 */

import Cluster from "../library/Cluster"


/**
 * Graph class which holds the nodes and edges of the graph.
 */
export class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes
        this.edges = edges
    }
}

/**
 * Node class holding the vectors that are in this node.
 */
export class Node {
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
                    if (dstCluster.vectors.find(dstVec => srcVec.view.lineIndex == dstVec.view.lineIndex && srcVec.view.sequenceIndex + 1 == dstVec.view.sequenceIndex)) {
                        bundle.push(srcVec.view.lineIndex)
                    }
                })

                if (bundle.length > 10) {
                    var edge = new Edge(srcCluster, dstCluster, [...new Set(bundle)])
                    edges.push(edge)
                }
            }
        })

    })
    console.log(edges)
    return [edges]
}