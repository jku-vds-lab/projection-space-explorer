/**
 * Directed graph library for javascript.
 */


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
    constructor(source, destination, intersection) {
        this.source = source
        this.destination = destination
        this.intersection = intersection
    }
}



/**
 * Performs the graphing algorithm.
 * @param {*} clusters 
 * @param {*} vectors 
 */
export function graphLayout(clusters) {
    var edges = []
    var nodes = []

    Object.keys(clusters).forEach(key => {
        var cluster = clusters[key]
        cluster.node = new Node(cluster.vectors)
    })

    // For each cluster,
    Object.keys(clusters).forEach(srcKey => {
        var srcCluster = clusters[srcKey]
        Object.keys(clusters).forEach(dstKey => {
            var dstCluster = clusters[dstKey]
            if (dstCluster != srcCluster) {
                var bundle = []

                // For each vector in source cluster, check if the direct ancestor is in the destination cluster
                srcCluster.vectors.forEach(srcVec => {
                    if (dstCluster.vectors.find(dstVec => srcVec.lineIndex == dstVec.lineIndex && srcVec.view.sequenceIndex == dstVec.view.sequenceIndex + 1)) {
                        bundle.push(srcVec.view.lineIndex)
                    }
                })

                if (bundle.length > 20) {
                    var edge = new Edge(srcCluster.node, dstCluster.node, [...new Set(bundle)])
                    edges.push(edge)
                }
            }
        })

    })

    return [nodes, edges]
}