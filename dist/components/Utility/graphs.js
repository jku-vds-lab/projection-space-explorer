"use strict";
/**
 * Directed graph library for javascript.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../../model/ObjectType");
/**
 * Performs a basic path bundling algorithm and tries to extract
 * the most prominent edges between clusters.
 *
 * @param {Dataset} dataset the current dataset
 * @param {ICluster[]} clusters a list of clusters to perform the edge extraction
 */
function graphLayout(dataset, clusters) {
    var edges = [];
    // For each cluster,
    clusters.forEach((_, srcKey) => {
        var srcCluster = clusters[srcKey];
        clusters.forEach((_, dstKey) => {
            var dstCluster = clusters[dstKey];
            if (dstCluster != srcCluster) {
                var bundle = [];
                // For each vector in source cluster, check if the direct ancestor is in the destination cluster
                srcCluster.indices.map(i => dataset.vectors[i]).forEach(srcVec => {
                    if (dstCluster.indices.map(i => dataset.vectors[i]).find(dstVec => srcVec.line == dstVec.line && srcVec.__meta__.sequenceIndex + 1 == dstVec.__meta__.sequenceIndex)) {
                        bundle.push(srcVec.line);
                    }
                });
                if (bundle.length > 10) {
                    const edge = {
                        objectType: ObjectType_1.ObjectTypes.Edge,
                        source: srcKey.toString(),
                        destination: dstKey.toString(),
                        name: null
                    };
                    edges.push(edge);
                }
            }
        });
    });
    return [edges];
}
exports.graphLayout = graphLayout;
function storyLayout(clusterInstances, edges) {
    const stories = [];
    const copy = edges.slice(0);
    while (copy.length > 0) {
        const toProcess = [copy.splice(0, 1)[0]];
        const clusterSet = new Set();
        const edgeSet = new Set();
        while (toProcess.length > 0) {
            var edge = toProcess.splice(0, 1)[0];
            do {
                clusterSet.add(clusterInstances[edge.source]);
                clusterSet.add(clusterInstances[edge.destination]);
                edgeSet.add(edge);
                var idx = copy.findIndex(value => value.destination == edge.source || value.source == edge.destination);
                if (idx >= 0) {
                    var removed = copy.splice(idx, 1)[0];
                    clusterSet.add(clusterInstances[removed.source]);
                    clusterSet.add(clusterInstances[removed.destination]);
                    edgeSet.add(removed);
                    toProcess.push(removed);
                }
            } while (idx >= 0);
        }
        const clusterResult = [...clusterSet];
        const edgeResult = ([...edgeSet]).map(edge => {
            return {
                source: clusterResult.indexOf(clusterInstances[edge.source]).toString(),
                destination: clusterResult.indexOf(clusterInstances[edge.destination]).toString(),
                objectType: ObjectType_1.ObjectTypes.Edge
            };
        });
        const story = transformIndicesToHandles(clusterResult, edgeResult);
        stories.push(story);
    }
    return stories;
}
exports.storyLayout = storyLayout;
function transformIndicesToHandles(clusterResult, edgeResult) {
    const story = {
        clusters: {
            byId: {},
            allIds: []
        },
        edges: {
            byId: {},
            allIds: []
        }
    };
    clusterResult.forEach((cluster, clusterIndex) => {
        const handle = clusterIndex.toString();
        story.clusters.byId[handle] = cluster;
        edgeResult.forEach(edge => {
            if (edge.source === clusterIndex.toString()) {
                edge.source = handle;
            }
            if (edge.destination === clusterIndex.toString()) {
                edge.destination = handle;
            }
        });
    });
    edgeResult.forEach((edge, i) => {
        const handle = i;
        story.edges.byId[handle] = edge;
    });
    story.clusters.allIds = Object.keys(story.clusters.byId);
    story.edges.allIds = Object.keys(story.edges.byId);
    return story;
}
exports.transformIndicesToHandles = transformIndicesToHandles;
