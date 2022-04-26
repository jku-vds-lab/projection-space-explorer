import { EntityId, Update, ReducersMapObject, EntityState, Reducer, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ViewTransformType } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, IPosition, Dataset } from '../../model';
import { ContinuousMapping, DiscreteMapping } from '../Utility';
export declare const setWorkspaceAction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string | number | IProjection, string>;
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
export declare type SingleMultipleAttributes = {
    channelColor: any;
    channelBrightness: any;
    channelSize: any;
    vectorByShape: any;
    viewTransform: ViewTransformType;
    lineBrightness: number;
    pointColorScale: EntityId;
    pointColorMapping: any;
    pathLengthRange: {
        range: number[];
        maximum: number;
    };
    globalPointSize: number[];
    globalPointBrightness: number[];
    workspace: EntityId | IProjection;
};
export declare type SingleMultiple = {
    id: EntityId;
    attributes: SingleMultipleAttributes;
};
export declare const multipleAdapter: import("@reduxjs/toolkit").EntityAdapter<SingleMultiple>;
export declare function createViewDuckReducer<T>(additionalViewReducer?: ReducersMapObject<T, any>, additionalCustomCases?: (builder: ActionReducerMapBuilder<{
    multiples: EntityState<{
        id: EntityId;
        attributes: SingleMultipleAttributes & T;
    }>;
    active: EntityId;
    projections: EntityState<IProjection>;
}>) => void): import("@reduxjs/toolkit").Slice<{
    multiples: EntityState<{
        id: EntityId;
        attributes: SingleMultipleAttributes & T;
    }>;
    active: EntityId;
    projections: EntityState<IProjection>;
}, {}, "multiples">;
export declare const ViewActions: {
    addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Dataset, string>;
    activateView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    deleteView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    loadById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    add: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IProjection, string>;
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
};
export declare const ViewSelector: {
    selectAll: import("reselect/*").OutputSelector<import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck copy").IStorytelling, import("redux").AnyAction>;
        openTab: (state: number, action: any) => any;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }, import("redux").AnyAction>;
        activeLine: (state: any, action: any) => string;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: (state: any[], action: any) => any;
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
        genericFingerprintAttributes: (state: any[], action: any) => any[];
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: typeof import("./DetailViewDuck").default;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState, import("redux").AnyAction>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<{
            multiples: EntityState<{
                id: EntityId;
                attributes: SingleMultipleAttributes;
            }>;
            active: EntityId;
            projections: EntityState<IProjection>;
        }, import("redux").AnyAction>;
    }>, {
        multiples: EntityState<{
            id: EntityId;
            attributes: SingleMultipleAttributes;
        }>;
        active: EntityId;
        projections: EntityState<IProjection>;
    }, (res: {
        multiples: EntityState<{
            id: EntityId;
            attributes: SingleMultipleAttributes;
        }>;
        active: EntityId;
        projections: EntityState<IProjection>;
    }) => {
        multiples: EntityState<{
            id: EntityId;
            attributes: SingleMultipleAttributes;
        }>;
        active: EntityId;
        projections: EntityState<IProjection>;
    }>;
    defaultSelector: (state: RootState) => {
        id: EntityId;
        attributes: SingleMultipleAttributes;
    };
    getWorkspaceById: import("reselect/*").OutputParametricSelector<any, EntityId, IProjection, (res1: {
        multiples: EntityState<{
            id: EntityId;
            attributes: SingleMultipleAttributes;
        }>;
        active: EntityId;
        projections: EntityState<IProjection>;
    }, res2: EntityId) => IProjection>;
    getWorkspace: import("reselect/*").OutputSelector<import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck copy").IStorytelling, import("redux").AnyAction>;
        openTab: (state: number, action: any) => any;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }, import("redux").AnyAction>;
        activeLine: (state: any, action: any) => string;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: (state: any[], action: any) => any;
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
        genericFingerprintAttributes: (state: any[], action: any) => any[];
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: typeof import("./DetailViewDuck").default;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState, import("redux").AnyAction>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<{
            multiples: EntityState<{
                id: EntityId;
                attributes: SingleMultipleAttributes;
            }>;
            active: EntityId;
            projections: EntityState<IProjection>;
        }, import("redux").AnyAction>;
    }>, IProjection, (res: IProjection) => IProjection>;
    workspaceIsTemporal: import("reselect/*").OutputSelector<import("../Store").ReducerValues<{
        currentAggregation: (state: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        }, action: any) => {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: Reducer<import("./StoriesDuck copy").IStorytelling, import("redux").AnyAction>;
        openTab: (state: number, action: any) => any;
        pointDisplay: Reducer<{
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        }, import("redux").AnyAction>;
        activeLine: (state: any, action: any) => string;
        dataset: typeof import("./DatasetDuck").default;
        highlightedSequence: (state: any, action: any) => any;
        advancedColoringSelection: (state: any[], action: any) => any;
        projectionColumns: (state: any[], action: any) => any;
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
        genericFingerprintAttributes: (state: any[], action: any) => any[];
        hoverStateOrientation: (state: import("./HoverStateOrientationDuck").HoverStateOrientation, action: any) => any;
        detailView: typeof import("./DetailViewDuck").default;
        datasetEntries: typeof import("./DatasetEntriesDuck").default;
        globalLabels: Reducer<import("./GlobalLabelsDuck").GlobalLabelsState, import("redux").AnyAction>;
        colorScales: typeof import("./ColorScalesDuck").default;
        multiples: Reducer<{
            multiples: EntityState<{
                id: EntityId;
                attributes: SingleMultipleAttributes;
            }>;
            active: EntityId;
            projections: EntityState<IProjection>;
        }, import("redux").AnyAction>;
    }>, boolean, (res: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean>;
};
