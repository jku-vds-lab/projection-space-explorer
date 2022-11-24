import { EntityId, PayloadAction, Update } from '@reduxjs/toolkit';
import { ViewTransformType } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, IPosition, Dataset } from '../../model';
import { Mapping } from '../Utility';
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
export declare const singleTestReducer: import("redux").Reducer<import("redux").CombinedState<{
    channelColor: CategoryOption;
    channelSize: CategoryOption;
    channelBrightness: CategoryOption;
    vectorByShape: any;
    viewTransform: ViewTransformType;
    lineBrightness: any;
    pointColorMapping: Mapping;
    pointColorScale: EntityId;
    pathLengthRange: {
        range: any;
        maximum: number;
    } | {
        range: number[];
        maximum: any;
    };
    globalPointSize: number[];
    globalPointBrightness: number[];
    workspace: EntityId | IProjection;
}>, import("redux").AnyAction>;
export declare const multiplesSlice: import("@reduxjs/toolkit").Slice<import("immer/dist/internal").WritableDraft<{
    multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
    active: string | number;
    projections: import("@reduxjs/toolkit").EntityState<IProjection>;
}>, {
    addView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<Dataset>): void;
    activateView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    deleteView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    loadById(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    add(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<IProjection>): void;
    copyFromWorkspace(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>): void;
    updateActive(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<{
        positions: IPosition[];
        metadata: any;
    }>): void;
    remove(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    save(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<Update<IProjection>>): void;
    setPointColorMapping(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<{
        multipleId: EntityId;
        value: Mapping;
    }>): void;
    changeDivergingRange(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<[
        number,
        number,
        number
    ] | [
        number,
        number
    ]>): void;
    selectChannel(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<{
        dataset: Dataset;
        channel: 'x' | 'y';
        value: string;
    }>): void;
}, "multiples">;
export declare const ViewActions: {
    addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Dataset, "multiples/addView">;
    activateView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "multiples/activateView">;
    deleteView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "multiples/deleteView">;
    loadById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "multiples/loadById">;
    add: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IProjection, "multiples/add">;
    copyFromWorkspace: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"multiples/copyFromWorkspace">;
    updateActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        positions: IPosition[];
        metadata: any;
    }, "multiples/updateActive">;
    remove: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "multiples/remove">;
    save: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Update<IProjection>, "multiples/save">;
    setPointColorMapping: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        multipleId: EntityId;
        value: Mapping;
    }, "multiples/setPointColorMapping">;
    changeDivergingRange: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<[number, number, number] | [number, number], "multiples/changeDivergingRange">;
    selectChannel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        dataset: Dataset;
        channel: 'x' | 'y';
        value: string;
    }, "multiples/selectChannel">;
};
export declare const ViewSelector: {
    selectAll: ((state: import("redux").EmptyObject & {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("immer/dist/internal").WritableDraft<import("./StoriesDuck").IStorytelling>;
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
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: import("immer/dist/internal").WritableDraft<{
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: string | number;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        }>;
    }) => import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>) & import("reselect").OutputSelectorFields<(args_0: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>) => import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }> & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    defaultSelector: (state: RootState) => import("immer/dist/internal").WritableDraft<SingleMultiple>;
    getWorkspaceById: ((state: any, multipleId: EntityId) => import("immer/dist/internal").WritableDraft<IProjection>) & import("reselect").OutputSelectorFields<(args_0: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: string | number;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, args_1: EntityId) => import("immer/dist/internal").WritableDraft<IProjection> & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    getWorkspace: ((state: import("redux").EmptyObject & {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("immer/dist/internal").WritableDraft<import("./StoriesDuck").IStorytelling>;
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
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: import("immer/dist/internal").WritableDraft<{
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: string | number;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        }>;
    }) => import("immer/dist/internal").WritableDraft<IProjection>) & import("reselect").OutputSelectorFields<(args_0: import("immer/dist/internal").WritableDraft<IProjection>) => import("immer/dist/internal").WritableDraft<IProjection> & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
    workspaceIsTemporal: ((state: import("redux").EmptyObject & {
        currentAggregation: {
            aggregation: number[];
            selectedClusters: (string | number)[];
            source: "sample" | "cluster";
        };
        stories: import("immer/dist/internal").WritableDraft<import("./StoriesDuck").IStorytelling>;
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
        colorScales: import("./ColorScalesDuck").ColorScalesType;
        multiples: import("immer/dist/internal").WritableDraft<{
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: string | number;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        }>;
    }) => boolean) & import("reselect").OutputSelectorFields<(args_0: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean & {
        clearCache: () => void;
    }> & {
        clearCache: () => void;
    };
};
