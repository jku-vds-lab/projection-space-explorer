import { EntityId, Update, ReducersMapObject, EntityState, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ViewTransformType } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, IPosition, Dataset } from '../../model';
import { ContinuousMapping, DiscreteMapping, Mapping } from '../Utility';
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
    changeDivergingRange: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<[number, number, number] | [number, number], string>;
};
export declare const ViewSelector: {
    selectAll: ((state: {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck").IStorytelling;
        openTab: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: string;
        dataset: Dataset;
        highlightedSequence: any;
        advancedColoringSelection: any;
        projectionColumns: import("./ProjectionColumnsDuck").ProjectionColumn[];
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
        clusterMode: import("./ClusterModeDuck").ClusterMode;
        displayMode: import("./DisplayModeDuck").DisplayMode;
        hoverState: import("./HoverStateDuck").HoverStateType;
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
            active: number;
        };
        datasetEntries: {
            values: {
                byId: {
                    [id: string]: import("../../model").DatasetEntry;
                };
                allIds: string[];
            };
        };
        globalLabels: import("./GlobalLabelsDuck").GlobalLabelsState;
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: StateType<unknown>;
    }) => StateType<unknown>) & import("reselect").OutputSelectorFields<(args_0: StateType<unknown>) => StateType<unknown> & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    defaultSelector: (state: RootState) => {
        id: EntityId;
        attributes: SingleMultipleAttributes;
    };
    getWorkspaceById: ((state: {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck").IStorytelling;
        openTab: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: string;
        dataset: Dataset;
        highlightedSequence: any;
        advancedColoringSelection: any;
        projectionColumns: import("./ProjectionColumnsDuck").ProjectionColumn[];
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
        clusterMode: import("./ClusterModeDuck").ClusterMode;
        displayMode: import("./DisplayModeDuck").DisplayMode;
        hoverState: import("./HoverStateDuck").HoverStateType;
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
            active: number;
        };
        datasetEntries: {
            values: {
                byId: {
                    [id: string]: import("../../model").DatasetEntry;
                };
                allIds: string[];
            };
        };
        globalLabels: import("./GlobalLabelsDuck").GlobalLabelsState;
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: StateType<unknown>;
    }, params_0: EntityId) => IProjection) & import("reselect").OutputSelectorFields<(args_0: StateType<unknown>, args_1: EntityId) => IProjection & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    getWorkspace: ((state: {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck").IStorytelling;
        openTab: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: string;
        dataset: Dataset;
        highlightedSequence: any;
        advancedColoringSelection: any;
        projectionColumns: import("./ProjectionColumnsDuck").ProjectionColumn[];
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
        clusterMode: import("./ClusterModeDuck").ClusterMode;
        displayMode: import("./DisplayModeDuck").DisplayMode;
        hoverState: import("./HoverStateDuck").HoverStateType;
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
            active: number;
        };
        datasetEntries: {
            values: {
                byId: {
                    [id: string]: import("../../model").DatasetEntry;
                };
                allIds: string[];
            };
        };
        globalLabels: import("./GlobalLabelsDuck").GlobalLabelsState;
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: StateType<unknown>;
    }) => IProjection) & import("reselect").OutputSelectorFields<(args_0: IProjection) => IProjection & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    workspaceIsTemporal: ((state: {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck").IStorytelling;
        openTab: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: string;
        dataset: Dataset;
        highlightedSequence: any;
        advancedColoringSelection: any;
        projectionColumns: import("./ProjectionColumnsDuck").ProjectionColumn[];
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
        clusterMode: import("./ClusterModeDuck").ClusterMode;
        displayMode: import("./DisplayModeDuck").DisplayMode;
        hoverState: import("./HoverStateDuck").HoverStateType;
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
            active: number;
        };
        datasetEntries: {
            values: {
                byId: {
                    [id: string]: import("../../model").DatasetEntry;
                };
                allIds: string[];
            };
        };
        globalLabels: import("./GlobalLabelsDuck").GlobalLabelsState;
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: StateType<unknown>;
    }) => boolean) & import("reselect").OutputSelectorFields<(args_0: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
};
export {};
