import { EntityId, PayloadAction, Update } from '@reduxjs/toolkit';
import { ViewTransformType } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, IPosition, Dataset } from '../../model';
export declare const setWorkspaceAction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string | number | IProjection, string>;
export declare const workspaceReducer: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<string | number | IProjection>;
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
export declare const multiplesSlice: import("@reduxjs/toolkit").Slice<{
    multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
    active: EntityId;
    projections: import("@reduxjs/toolkit").EntityState<IProjection>;
}, {
    addView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<Dataset>): void;
    activateView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    deleteView(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    loadById(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    add(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<IProjection>): void;
    copyFromWorkspace(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>): void;
    updateActive(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<{
        positions: IPosition[];
        metadata: any;
    }>): void;
    remove(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<EntityId>): void;
    save(state: import("immer/dist/internal").WritableDraft<{
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>, action: PayloadAction<Update<IProjection>>): void;
}, "multiples">;
export declare const ViewActions: {
    addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Dataset, string>;
    activateView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    deleteView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    loadById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    add: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IProjection, string>;
    copyFromWorkspace: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
    updateActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        positions: IPosition[];
        metadata: any;
    }, string>;
    remove: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    save: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Update<IProjection>, string>;
};
export declare const ViewSelector: {
    selectAll: import("reselect/*").OutputSelector<import("redux").CombinedState<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck copy").IStorytelling;
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
        multiples: {
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: EntityId;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        };
    }>, {
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }, (res: {
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }) => {
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }>;
    defaultSelector: (state: RootState) => SingleMultiple;
    getWorkspaceById: import("reselect/*").OutputParametricSelector<any, EntityId, IProjection, (res1: {
        multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
        active: EntityId;
        projections: import("@reduxjs/toolkit").EntityState<IProjection>;
    }, res2: EntityId) => IProjection>;
    getWorkspace: import("reselect/*").OutputSelector<import("redux").CombinedState<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck copy").IStorytelling;
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
        multiples: {
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: EntityId;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        };
    }>, IProjection, (res: IProjection) => IProjection>;
    workspaceIsTemporal: import("reselect/*").OutputSelector<import("redux").CombinedState<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck copy").IStorytelling;
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
        multiples: {
            multiples: import("@reduxjs/toolkit").EntityState<SingleMultiple>;
            active: EntityId;
            projections: import("@reduxjs/toolkit").EntityState<IProjection>;
        };
    }>, boolean, (res: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean>;
};
