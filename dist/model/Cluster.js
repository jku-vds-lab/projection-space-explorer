"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const ObjectType_1 = require("./ObjectType");
/**
 * Cluster methods.
 */
class ACluster {
    static calcBounds(dataset, indices) {
        const samples = indices.map(i => dataset.vectors[i]);
        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        samples.forEach(sample => {
            minX = Math.min(minX, sample.x);
            maxX = Math.max(maxX, sample.x);
            minY = Math.min(minY, sample.y);
            maxY = Math.max(maxY, sample.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        };
    }
    static fromSamples(dataset, samples) {
        return {
            objectType: ObjectType_1.ObjectTypes.Cluster,
            indices: samples,
            label: Math.floor(Math.random() * 1000)
        };
    }
    /**
     * Resets the labeling for given vectors based on given clusters
     *
     * @param vectors The vectors to relabel
     * @param clusters The clusters to take the label from
     */
    static deriveVectorLabelsFromClusters(vectors, clusters) {
        // Clear all cluster labels from vectors
        vectors.forEach(vector => {
            vector.groupLabel = [];
        });
        // Create new labels from clusters
        clusters.forEach(cluster => {
            cluster.indices.map(i => vectors[i]).forEach(vector => {
                vector.groupLabel.push(cluster.label);
            });
        });
    }
    static getCenter(dataset, cluster) {
        var x = 0;
        var y = 0;
        cluster.indices.map(i => dataset.vectors[i]).forEach(p => {
            x = x + p.x;
            y = y + p.y;
        });
        return {
            x: x / cluster.indices.length,
            y: y / cluster.indices.length
        };
    }
    static getCenterAsVector2(dataset, cluster) {
        let center = ACluster.getCenter(dataset, cluster);
        return new THREE.Vector2(center.x, center.y);
    }
    static getTextRepresentation(cluster) {
        if (cluster.name) {
            return `${cluster.label} / ${cluster.name}`;
        }
        else {
            return "" + cluster.label;
        }
    }
}
exports.ACluster = ACluster;
/**
 * Cluster type guard.
 */
function isCluster(object) {
    return object && object.objectType === ObjectType_1.ObjectTypes.Cluster;
}
exports.isCluster = isCluster;
