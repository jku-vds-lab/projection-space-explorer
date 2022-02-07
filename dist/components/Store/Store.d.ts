import { ClusterMode } from '../Ducks/ClusterModeDuck';
import { ProjectionStateType } from '../Ducks/ProjectionDuck';
import { Dataset } from '../../model';
import { BaseColorScale } from '../../model/Palette';
import { IStorytelling } from '../Ducks/StoriesDuck copy';
export declare function createInitialReducerState(dataset: Dataset): Partial<RootState>;
export declare const rootReducer: (state: any, action: any) => import("redux").CombinedState<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: import("@reduxjs/toolkit").EntityId[];
        source: "sample" | "cluster";
    };
    stories: IStorytelling;
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
    dataset: Dataset;
    highlightedSequence: any;
    viewTransform: import("../Ducks/ViewTransformDuck").ViewTransformType;
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
    hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
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
                [id: string]: import("../../model").DatasetEntry;
            };
            allIds: string[];
        };
    };
    colorScales: {
        scales: import("../Utility/NormalizedState").NormalizedDictionary<BaseColorScale>;
        active: string;
    };
}>;
export declare function createRootReducer(reducers: any): (state: any, action: any) => any;
export declare type RootState = ReturnType<typeof rootReducer>;
