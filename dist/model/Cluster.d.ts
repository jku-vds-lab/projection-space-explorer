import * as THREE from 'three';
import { Dataset } from './Dataset';
import { TypedObject } from './TypedObject';
import { IVector } from "./Vector";
import { IBaseProjection } from './Projection';
/**
 * Cluster API.
 */
export declare class ACluster {
    static calcBounds(workspace: IBaseProjection, indices: number[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    static fromSamples(dataset: Dataset, samples: number[]): ICluster;
    /**
     * Resets the labeling for given vectors based on given clusters
     *
     * @param vectors The vectors to relabel
     * @param clusters The clusters to take the label from
     */
    static deriveVectorLabelsFromClusters(vectors: IVector[], clusters: ICluster[]): void;
    static getCenterFromWorkspace(workspace: IBaseProjection, cluster: ICluster): {
        x: number;
        y: number;
    };
    static getCenterAsVector2(workspace: IBaseProjection, cluster: ICluster): THREE.Vector2;
    static getTextRepresentation(cluster: ICluster): string;
}
/**
 * Cluster type.
 */
export interface ICluster extends TypedObject {
    label: any;
    hull?: number[][];
    triangulation?: number[];
    name?: string;
    /**
     * List of indices on the dataset vectors this cluster has.
     */
    indices: number[];
}
/**
 * Cluster type guard.
 */
export declare function isCluster(object: TypedObject): object is ICluster;
