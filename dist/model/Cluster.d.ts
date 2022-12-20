import * as THREE from 'three';
import { Dataset } from './Dataset';
import { TypedObject } from './TypedObject';
import { IBaseProjection } from './ProjectionInterfaces';
import { ICluster } from './ICluster';
/**
 * Cluster API.
 */
export declare class ACluster {
    static calcBounds(positions: IBaseProjection, indices: number[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    static fromSamples(dataset: Dataset, samples: number[], metadata?: any): ICluster;
    static getCenterFromWorkspace(positions: IBaseProjection, cluster: ICluster): {
        x: number;
        y: number;
    };
    static getCenterAsVector2(positions: IBaseProjection, cluster: ICluster): THREE.Vector2;
    static getTextRepresentation(cluster: ICluster): string;
}
/**
 * Cluster type guard.
 */
export declare function isCluster(object: TypedObject): object is ICluster;
