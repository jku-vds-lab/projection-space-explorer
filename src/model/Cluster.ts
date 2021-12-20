import * as THREE from 'three'
import { Dataset } from './Dataset';
import { ObjectTypes } from './ObjectType';
import { TypedObject } from './TypedObject';
import { IVector } from "./Vector"
import { IBaseProjection } from './Projection';


/**
 * Cluster API.
 */
export class ACluster {
    static calcBounds(workspace: IBaseProjection, indices: number[]) {
        const samples = indices.map(i => workspace[i])

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
            objectType: ObjectTypes.Cluster,
            indices: samples,
            label: Math.floor(Math.random() * 1000)
        }
    }



    /**
     * Resets the labeling for given vectors based on given clusters
     * 
     * @param vectors The vectors to relabel
     * @param clusters The clusters to take the label from
     */
    static deriveVectorLabelsFromClusters(vectors: IVector[], clusters: ICluster[]) {
        // Clear all cluster labels from vectors
        vectors.forEach(vector => {
            vector.groupLabel = []
        })

        // Create new labels from clusters
        clusters.forEach(cluster => {
            cluster.indices.map(i => vectors[i]).forEach(vector => {
                vector.groupLabel.push(cluster.label)
            })
        })
    }

    static getCenterFromWorkspace(workspace: IBaseProjection, cluster: ICluster) {
        var x = 0
        var y = 0

        cluster.indices.map(i => workspace[i]).forEach(p => {
            x = x + p.x
            y = y + p.y
        })

        return {
            x: x / cluster.indices.length,
            y: y / cluster.indices.length
        }
    }

    static getCenterAsVector2(workspace: IBaseProjection, cluster: ICluster) {
        let center = ACluster.getCenterFromWorkspace(workspace, cluster)
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

/**
 * Cluster type.
 */
export interface ICluster extends TypedObject {
    label: any

    hull?: number[][]
    triangulation?: number[]
    name?: string

    /**
     * List of indices on the dataset vectors this cluster has.
     */
    indices: number[]
}


/**
 * Cluster type guard.
 */
export function isCluster(object: TypedObject): object is ICluster {
    return object && object.objectType === ObjectTypes.Cluster
}

