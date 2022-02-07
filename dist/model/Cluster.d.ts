import { Dataset } from './Dataset';
import { TypedObject } from './TypedObject';
import { IVector } from './Vector';
import { IBaseProjection } from './ProjectionInterfaces';
import { ICluster } from './ICluster';
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
    static fromSamples(dataset: Dataset, samples: number[], metadata?: any): ICluster;
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
    static getCenterAsVector2(workspace: IBaseProjection, cluster: ICluster): any;
    static getTextRepresentation(cluster: ICluster): string;
}
/**
 * Cluster type guard.
 */
export declare function isCluster(object: TypedObject): object is ICluster;
