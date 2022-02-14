import { EntityState, EntityId, Update } from '@reduxjs/toolkit';
import { IProjection, IPosition } from '../../model/ProjectionInterfaces';
/**
 * Type for embedding state slice
 */
export declare type ProjectionStateType = {
    values: EntityState<IProjection>;
    workspace: IProjection | EntityId;
};
export declare const embeddings: import("redux").Reducer<ProjectionStateType, import("redux").AnyAction>;
export declare const ProjectionActions: {
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
export declare const ProjectionSelectors: {
    getWorkspace: import("reselect/*").OutputSelector<import("redux").CombinedState<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: EntityId[];
            source: "sample" | "cluster";
        };
        stories: import("./StoriesDuck copy").IStorytelling;
        openTab: any;
        selectedVectorByShape: any;
        vectorByShape: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: any;
        dataset: import("../..").Dataset;
        highlightedSequence: any;
        viewTransform: import("./ViewTransformDuck").ViewTransformType;
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
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        globalPointSize: number[];
        hoverState: import("./HoverStateDuck").HoverStateType;
        pointColorScale: any;
        pointColorMapping: any;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        differenceThreshold: any;
        projections: ProjectionStateType;
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
        globalPointBrightness: number[];
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
                    [id: string]: import("../..").DatasetEntry;
                };
                allIds: string[];
            };
        };
        colorScales: {
            scales: import("..").NormalizedDictionary<import("../..").BaseColorScale>;
            active: string;
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
        selectedVectorByShape: any;
        vectorByShape: any;
        pointDisplay: {
            checkedShapes: {
                star: boolean;
                cross: boolean;
                circle: boolean;
                square: boolean;
            };
        };
        activeLine: any;
        dataset: import("../..").Dataset;
        highlightedSequence: any;
        viewTransform: import("./ViewTransformDuck").ViewTransformType;
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
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        globalPointSize: number[];
        hoverState: import("./HoverStateDuck").HoverStateType;
        pointColorScale: any;
        pointColorMapping: any;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        differenceThreshold: any;
        projections: ProjectionStateType;
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
        globalPointBrightness: number[];
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
                    [id: string]: import("../..").DatasetEntry;
                };
                allIds: string[];
            };
        };
        colorScales: {
            scales: import("..").NormalizedDictionary<import("../..").BaseColorScale>;
            active: string;
        };
    }>, boolean, (res: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") => boolean>;
};
