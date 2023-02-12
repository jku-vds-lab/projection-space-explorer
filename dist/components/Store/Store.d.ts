import { EntityState, EntityId } from '@reduxjs/toolkit';
import { Reducer, ReducersMapObject } from 'redux';
import dataset from '../Ducks/DatasetDuck';
import clusterMode from '../Ducks/ClusterModeDuck';
import displayMode from '../Ducks/DisplayModeDuck';
import projectionWorker from '../Ducks/ProjectionWorkerDuck';
import trailSettings from '../Ducks/TrailSettingsDuck';
import { selectedLineBy } from '../Ducks/SelectedLineByDuck';
import { GroupVisualizationMode } from '../Ducks/GroupVisualizationMode';
import datasetEntries from '../Ducks/DatasetEntriesDuck';
import { Dataset, IProjection } from '../../model';
import colorScales from '../Ducks/ColorScalesDuck';
import { IStorytelling } from '../Ducks/StoriesDuck';
declare const allReducers: {
    currentAggregation: (state: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    }, action: any) => {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    stories: Reducer<IStorytelling, import("redux").AnyAction>;
    openTab: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
        openTab: number;
        focusedTab: number[];
    }>;
    pointDisplay: Reducer<{
        checkedShapes: {
            star: boolean;
            cross: boolean;
            circle: boolean;
            square: boolean;
        };
    }, import("redux").AnyAction>;
    activeLine: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<string>;
    dataset: typeof dataset;
    highlightedSequence: (state: any, action: any) => any;
    advancedColoringSelection: (state: any[], action: any) => any;
    projectionColumns: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<import("../Ducks/ProjectionColumnsDuck").ProjectionColumn[]>;
    projectionOpen: (state: boolean, action: any) => any;
    projectionParams: (state: {
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
    }, action: any) => {
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
    projectionWorker: typeof projectionWorker;
    clusterMode: typeof clusterMode;
    displayMode: typeof displayMode;
    hoverState: (state: import("../Ducks/HoverStateDuck").HoverStateType, action: any) => import("../Ducks/HoverStateDuck").HoverStateType;
    trailSettings: typeof trailSettings;
    differenceThreshold: (state: number, action: any) => any;
    hoverSettings: (state: {
        windowMode: import("../Ducks/HoverSettingsDuck").WindowMode;
    }, action: any) => {
        windowMode: any;
    };
    selectedLineBy: typeof selectedLineBy;
    groupVisualizationMode: (state: GroupVisualizationMode, action: any) => any;
    genericFingerprintAttributes: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<any[]>;
    hoverStateOrientation: (state: import("../Ducks/HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
    detailView: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
        open: boolean;
        active: number;
    }>;
    datasetEntries: typeof datasetEntries;
    globalLabels: Reducer<import("../Ducks/GlobalLabelsDuck").GlobalLabelsState, import("redux").AnyAction>;
    colorScales: typeof colorScales;
    multiples: Reducer<{
        multiples: EntityState<{
            id: EntityId;
            attributes: import("../Ducks/ViewDuck").SingleMultipleAttributes;
        }>;
        active: EntityId;
        projections: EntityState<IProjection>;
    }, import("redux").AnyAction>;
};
export type ReducerValues<T extends ReducersMapObject> = {
    [K in keyof T]: ReturnType<T[K]>;
};
export declare function createInitialReducerState(dataset: Dataset): Partial<RootState>;
/**
 * Utility function that creates the global reducer for PSE.
 *
 * @param reducers A list of additional reducers that can be passed to the internal PSE state.
 * @returns a reducer that includes all additional reducers alongside PSE´s internal ones.
 */
export declare function createRootReducer<T>(reducers?: ReducersMapObject<T, any>): Reducer<RootState & T>;
export type RootState = ReducerValues<typeof allReducers>;
export declare const usePSESelector: <T>(fn: (state: RootState) => T) => T;
export {};
//# sourceMappingURL=Store.d.ts.map