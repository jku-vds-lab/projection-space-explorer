import * as THREE from 'three'
import { Dataset } from './Dataset';
import { Vect } from "./Vect"



export class ClusterObject {
    static calcBounds(dataset: Dataset, indices: number[]) {
        const samples = indices.map(i => dataset.vectors[i])

        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        samples.forEach(sample => {
            minX = Math.min(minX, sample.x)
            maxX = Math.max(maxX, sample.x)
            minY = Math.min(minY, sample.y)
            maxY = Math.max(maxY, sample.y)
        })

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        }
    }

    static fromSamples(dataset: Dataset, samples: number[]): ICluster {
        return {
            refactored: samples,
            label: Math.floor(Math.random() * 1000),
            bounds: ClusterObject.calcBounds(dataset, samples)
        }
    }



    /**
     * Resets the labeling for given vectors based on given clusters
     * 
     * @param vectors The vectors to relabel
     * @param clusters The clusters to take the label from
     */
    static deriveVectorLabelsFromClusters(vectors: Vect[], clusters: ICluster[]) {
        // Clear all cluster labels from vectors
        vectors.forEach(vector => {
            vector.groupLabel = []
        })

        // Create new labels from clusters
        clusters.forEach(cluster => {
            cluster.refactored.map(i => vectors[i]).forEach(vector => {
                vector.groupLabel.push(cluster.label)
            })
        })
    }


    static containsPoint(cluster: ICluster, coords) {
        var x = coords.x
        var y = coords.y
        if (x > cluster.bounds.minX && x < cluster.bounds.maxX && y < cluster.bounds.maxY && y > cluster.bounds.minY) {
            return true
        }

        return false
    }

    static getCenter(dataset: Dataset, cluster: ICluster) {
        var x = 0
        var y = 0

        cluster.refactored.map(i => dataset.vectors[i]).forEach(p => {
            x = x + p.x
            y = y + p.y
        })

        return {
            x: x / cluster.refactored.length,
            y: y / cluster.refactored.length
        }
    }

    static getCenterAsVector2(dataset: Dataset, cluster: ICluster) {
        let center = ClusterObject.getCenter(dataset, cluster)
        return new THREE.Vector2(center.x, center.y)
    }

    static getTextRepresentation(cluster: ICluster) {
        if (cluster.name) {
            return `${cluster.label} / ${cluster.name}`
        } else {
            return "" + cluster.label
        }
    }
}

export type ICluster = {
    label: any
    bounds: any
    hull?: any
    triangulation?: any
    vectors?: Vect[]
    name?: string

    refactored: number[]
}

export default class Cluster {
    label: any
    bounds: any
    hull: any
    triangulation: any
    vectors: Vect[]
    name: string

    constructor(bounds?, hull?, triangulation?) {
        this.bounds = bounds
        this.hull = hull
        this.triangulation = triangulation
    }
}