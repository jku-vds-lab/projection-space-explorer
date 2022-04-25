import { EntityState, EntityId } from '@reduxjs/toolkit';
import { CombinedState, Reducer, ReducersMapObject } from 'redux';
import { ClusterMode } from '../Ducks/ClusterModeDuck';
import { Dataset, IProjection } from '../../model';
import { IStorytelling } from '../Ducks/StoriesDuck copy';
declare const appReducer: Reducer<CombinedState<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: EntityId[];
        source: "sample" | "cluster";
    };
    stories: IStorytelling;
    openTab: any;
    pointDisplay: {
        checkedShapes: {
            star: boolean;
            cross: boolean;
            circle: boolean;
            square: boolean;
        };
    };
    activeLine: any;
    dataset: Dataset;
    highlightedSequence: any;
    advancedColoringSelection: any;
    projectionColumns: any;
    projectionOpen: any;
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: import("../../model/DistanceMetric").DistanceMetric;
        normalizationMethod: import("../../model/NormalizationMethod").NormalizationMethod;
        encodingMethod: import("../../model/EncodingMethod").EncodingMethod;
    };
    projectionWorker: Worker;
    clusterMode: ClusterMode;
    displayMode: import("../Ducks/DisplayModeDuck").DisplayMode;
    hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    differenceThreshold: any;
    hoverSettings: {
        windowMode: any;
    };
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    groupVisualizationMode: any;
    genericFingerprintAttributes: any[];
    hoverStateOrientation: any;
    detailView: {
        open: boolean;
        active: string;
    };
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("../../model").DatasetEntry;
            };
            allIds: string[];
        };
    };
    colorScales: import("../Ducks/ColorScalesDuck").ColorScalesType;
    multiples: {
        multiples: EntityState<import("../Ducks/ViewDuck").SingleMultiple>;
        active: EntityId;
        projections: EntityState<IProjection>;
    };
}>, import("redux").AnyAction>;
export declare function createInitialReducerState(dataset: Dataset): Partial<RootState>;
export declare const rootReducer: (state: any, action: any) => CombinedState<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: EntityId[];
        source: "sample" | "cluster";
    };
    stories: IStorytelling;
    openTab: any;
    pointDisplay: {
        checkedShapes: {
            star: boolean;
            cross: boolean;
            circle: boolean;
            square: boolean;
        };
    };
    activeLine: any;
    dataset: Dataset;
    highlightedSequence: any;
    advancedColoringSelection: any;
    projectionColumns: any;
    projectionOpen: any;
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: import("../../model/DistanceMetric").DistanceMetric;
        normalizationMethod: import("../../model/NormalizationMethod").NormalizationMethod;
        encodingMethod: import("../../model/EncodingMethod").EncodingMethod;
    };
    projectionWorker: Worker;
    clusterMode: ClusterMode;
    displayMode: import("../Ducks/DisplayModeDuck").DisplayMode;
    hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    differenceThreshold: any;
    hoverSettings: {
        windowMode: any;
    };
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    groupVisualizationMode: any;
    genericFingerprintAttributes: any[];
    hoverStateOrientation: any;
    detailView: {
        open: boolean;
        active: string;
    };
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("../../model").DatasetEntry;
            };
            allIds: string[];
        };
    };
    colorScales: import("../Ducks/ColorScalesDuck").ColorScalesType;
    multiples: {
        multiples: EntityState<import("../Ducks/ViewDuck").SingleMultiple>;
        active: EntityId;
        projections: EntityState<IProjection>;
    };
}>;
export declare function createRootReducer<T>(reducers: ReducersMapObject<T, any>): Reducer<RootState & T>;
export declare type RootState = ReturnType<typeof appReducer>;
export {};
