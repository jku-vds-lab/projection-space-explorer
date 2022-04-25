import { IEdge } from './Edge';
import { ICluster } from './ICluster';
import { FeatureType } from './FeatureType';
import { DatasetType } from './DatasetType';
import { DataLine } from './DataLine';
import type { IVector } from './Vector';
export declare enum PrebuiltFeatures {
    Line = "line",
    ClusterLabel = "groupLabel"
}
export declare const EXCLUDED_COLUMNS: string[];
export declare const EXCLUDED_COLUMNS_ALL: string[];
export declare const DefaultFeatureLabel = "Default";
export declare type ColumnType = {
    distinct: any;
    isNumeric: boolean;
    metaInformation: any;
    featureType: FeatureType;
    range: any;
    featureLabel: string;
    project: boolean;
};
export declare class SegmentFN {
    /**
     * Calculates the maximum path length for this dataset.
     */
    static getMaxPathLength(dataset: Dataset): number;
}
export declare class ADataset {
    /**
     * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
     * which is needed for the zoom to work correctly
     */
    static calculateBounds(dataset: Dataset): void;
    /**
     * Returns an array of columns that are available in the vectors
     */
    static getColumns(dataset: Dataset, excludeGenerated?: boolean): string[];
    /**
     * Returns the vectors in this dataset as a 2d array, which
     * can be used as input for tsne for example.
     */
    static asTensor(dataset: Dataset, projectionColumns: any, encodingMethod?: any, normalizationMethod?: any): {
        tensor: any[];
        featureTypes: any[];
    };
}
/**
 * Dataset class that holds all data, the ranges and additional stuff
 */
export declare class Dataset {
    vectors: IVector[];
    segments: DataLine[];
    bounds: {
        x: any;
        y: any;
        scaleBase: any;
        scaleFactor: any;
    };
    info: {
        path: string;
        type: DatasetType;
    };
    columns: {
        [name: string]: ColumnType;
    };
    type: DatasetType;
    multivariateLabels: boolean;
    isSequential: boolean;
    hasInitialScalarTypes: boolean;
    clusters: ICluster[];
    clusterEdges: IEdge[];
    inferredColumns: string[];
    metaInformation: any;
    categories: any;
    constructor(vectors: any, ranges: any, info: any, featureTypes: any, metaInformation?: {});
    getSegs(key?: string): DataLine[];
    checkSequential(): boolean;
    checkLabels(): void;
    inferRangeForAttribute(key: string): {
        min: number;
        max: number;
        inferred: boolean;
    };
    /**
     * Creates a map which shows the distinct types and data types of the columns.
     */
    calculateColumnTypes(ranges: any, featureTypes: any, metaInformation: any): void;
    /**
     * Infers an array of attributes that can be filtered after, these can be
     * categorical, sequential or continuous attribues.
     * @param {*} ranges
     */
    extractEncodingFeatures(ranges: any): {
        category: string;
        attributes: any[];
    }[];
}
