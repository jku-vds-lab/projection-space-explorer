import { EntityId, Update, ReducersMapObject, EntityState, Reducer, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ViewTransformType } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, IPosition, Dataset } from '../../model';
import { ContinuousMapping, DiscreteMapping, Mapping } from '../Utility/Colors';
import { CategoryOption } from '../WebGLView/CategoryOptions';
export declare const setWorkspaceAction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId | IProjection, string>;
export declare const projectionAdapter: import("@reduxjs/toolkit").EntityAdapter<IProjection>;
export declare function defaultAttributes(dataset?: Dataset): {
    channelBrightness: any;
    channelColor: any;
    channelSize: any;
    vectorByShape: any;
    viewTransform: {
        zoom: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
    };
    lineBrightness: number;
    pointColorScale: any;
    pointColorMapping: any;
    pathLengthRange: {
        range: number[];
        maximum: number;
    };
    globalPointBrightness: number[];
    globalPointSize: number[];
    workspace: IProjection;
};
export declare const attributesSlice: import("@reduxjs/toolkit").Slice<{
    channelBrightness: any;
    channelColor: any;
    channelSize: any;
    vectorByShape: any;
    viewTransform: {
        zoom: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
    };
    lineBrightness: number;
    pointColorScale: any;
    pointColorMapping: any;
    pathLengthRange: {
        range: number[];
        maximum: number;
    };
    globalPointBrightness: number[];
    globalPointSize: number[];
    workspace: IProjection;
}, {}, "attributes">;
export type SingleMultipleAttributes = {
    channelColor: CategoryOption;
    channelBrightness: CategoryOption;
    channelSize: CategoryOption;
    vectorByShape: CategoryOption;
    viewTransform: ViewTransformType;
    lineBrightness: number;
    pointColorScale: number | string;
    pointColorMapping: Mapping;
    pathLengthRange: {
        range: number[];
        maximum: number;
    };
    globalPointSize: number[];
    globalPointBrightness: number[];
    workspace: number | string | IProjection;
};
export type SingleMultiple = {
    id: number | string;
    attributes: SingleMultipleAttributes;
};
export declare const multipleAdapter: import("@reduxjs/toolkit").EntityAdapter<SingleMultiple>;
export declare function isEntityId(value: string | number | IProjection): value is EntityId;
type StateType<T> = {
    multiples: EntityState<{
        id: EntityId;
        attributes: SingleMultipleAttributes & T;
    }>;
    active: EntityId;
    projections: EntityState<IProjection>;
};
export declare function createViewDuckReducer<T>(additionalViewReducer?: ReducersMapObject<T, any>, additionalCustomCases?: (builder: ActionReducerMapBuilder<StateType<T>>) => void): import("@reduxjs/toolkit").Slice<StateType<T>, {}, "multiples">;
export declare const ViewActions: {
    addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        id: EntityId;
    }, string>;
    activateView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    deleteView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    loadById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    copyFromWorkspace: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"view/copyFromWorkspace">;
    updateActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        positions: IPosition[];
        metadata: any;
    }, string>;
    remove: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    save: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Update<IProjection>, string>;
    setPointColorMapping: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        multipleId: EntityId;
        value: DiscreteMapping | ContinuousMapping;
    }, string>;
    selectChannel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        dataset: Dataset;
        channel: 'x' | 'y';
        value: string;
    }, string>;
    changeDivergingRange: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<[number, number] | [number, number, number], string>;
};
export declare const ViewSelector: {
    selectAll: ((state: import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck").IStorytelling>;
        tabSettings: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            openTab: number;
            focusedTab: number[];
        }>;
        datasetLoader: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            isFetching: boolean;
            progress: number;
            entry: import("../../model").DatasetEntry;
        }>;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }>;
        activeLine: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<string>;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<import("./ProjectionColumnsDuck").ProjectionColumn[]>;
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
        projectionWorker: typeof import("./ProjectionWorkerDuck").default;
        clusterMode: typeof import("./ClusterModeDuck").default;
        displayMode: typeof import("./DisplayModeDuck").default;
        hoverState: (state: import("./HoverStateDuck").HoverStateType, action: any) => import("./HoverStateDuck").HoverStateType;
        trailSettings: typeof import("./TrailSettingsDuck").default;
        differenceThreshold: (state: number, action: any) => any;
        hoverSettings: (state: {
            windowMode: import("./HoverSettingsDuck").WindowMode;
        }, action: any) => {
            windowMode: any;
        };
        selectedLineBy: typeof import("./SelectedLineByDuck").selectedLineBy;
        groupVisualizationMode: (state: import("./GroupVisualizationMode").GroupVisualizationMode, action: any) => any;
        genericFingerprintAttributes: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<any[]>;
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            open: boolean;
            active: number;
        }>;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<StateType<unknown>>;
    }>) => StateType<unknown>) & import("reselect").OutputSelectorFields<(args_0: StateType<unknown>) => StateType<unknown>, {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    defaultSelector: (state: RootState) => {
        id: EntityId;
        attributes: SingleMultipleAttributes;
    };
    getWorkspaceById: ((state: any, multipleId: EntityId) => IProjection) & import("reselect").OutputSelectorFields<(args_0: StateType<unknown>, args_1: EntityId) => IProjection, {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    getWorkspace: ((state: import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck").IStorytelling>;
        tabSettings: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            openTab: number;
            focusedTab: number[];
        }>;
        datasetLoader: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            isFetching: boolean;
            progress: number;
            entry: import("../../model").DatasetEntry;
        }>;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }>;
        activeLine: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<string>;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<import("./ProjectionColumnsDuck").ProjectionColumn[]>;
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
        projectionWorker: typeof import("./ProjectionWorkerDuck").default;
        clusterMode: typeof import("./ClusterModeDuck").default;
        displayMode: typeof import("./DisplayModeDuck").default;
        hoverState: (state: import("./HoverStateDuck").HoverStateType, action: any) => import("./HoverStateDuck").HoverStateType;
        trailSettings: typeof import("./TrailSettingsDuck").default;
        differenceThreshold: (state: number, action: any) => any;
        hoverSettings: (state: {
            windowMode: import("./HoverSettingsDuck").WindowMode;
        }, action: any) => {
            windowMode: any;
        };
        selectedLineBy: typeof import("./SelectedLineByDuck").selectedLineBy;
        groupVisualizationMode: (state: import("./GroupVisualizationMode").GroupVisualizationMode, action: any) => any;
        genericFingerprintAttributes: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<any[]>;
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            open: boolean;
            active: number;
        }>;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<StateType<unknown>>;
    }>) => IProjection) & import("reselect").OutputSelectorFields<(args_0: IProjection) => IProjection, {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    workspaceIsTemporal: ((state: import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck").IStorytelling>;
        tabSettings: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            openTab: number;
            focusedTab: number[];
        }>;
        datasetLoader: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            isFetching: boolean;
            progress: number;
            entry: import("../../model").DatasetEntry;
        }>;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }>;
        activeLine: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<string>;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<import("./ProjectionColumnsDuck").ProjectionColumn[]>;
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
        projectionWorker: typeof import("./ProjectionWorkerDuck").default;
        clusterMode: typeof import("./ClusterModeDuck").default;
        displayMode: typeof import("./DisplayModeDuck").default;
        hoverState: (state: import("./HoverStateDuck").HoverStateType, action: any) => import("./HoverStateDuck").HoverStateType;
        trailSettings: typeof import("./TrailSettingsDuck").default;
        differenceThreshold: (state: number, action: any) => any;
        hoverSettings: (state: {
            windowMode: import("./HoverSettingsDuck").WindowMode;
        }, action: any) => {
            windowMode: any;
        };
        selectedLineBy: typeof import("./SelectedLineByDuck").selectedLineBy;
        groupVisualizationMode: (state: import("./GroupVisualizationMode").GroupVisualizationMode, action: any) => any;
        genericFingerprintAttributes: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<any[]>;
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
            open: boolean;
            active: number;
        }>;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<StateType<unknown>>;
    }>) => boolean) & import("reselect").OutputSelectorFields<(args_0: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean, {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
};
export {};
//# sourceMappingURL=ViewDuck.d.ts.map