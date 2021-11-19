import { ClusterMode } from "../Ducks/ClusterModeDuck";
import { StoriesType } from "../Ducks/StoriesDuck";
import { Dataset, IProjection, IBaseProjection } from '../../model';
import { CategoryOptions } from '../WebGLView/CategoryOptions';
export declare const rootReducer: (state: any, action: any) => import("redux").CombinedState<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    stories: StoriesType;
    openTab: any;
    selectedVectorByShape: any;
    vectorByShape: any;
    checkedShapes: any;
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
    categoryOptions: CategoryOptions;
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
    projections: {
        byId: {
            [id: string]: IProjection;
        };
        allIds: string[];
        workspace: IBaseProjection;
    };
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
}>;
export declare function createRootReducer(reducers: any): (state: any, action: any) => any;
export declare type RootState = ReturnType<typeof rootReducer>;
