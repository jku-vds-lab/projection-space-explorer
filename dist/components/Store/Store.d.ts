export declare const rootReducer: (state: any, action: any) => import("redux").CombinedState<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    stories: import("../Ducks/StoriesDuck").StoriesType;
    openTab: any;
    selectedVectorByShape: any;
    vectorByShape: any;
    checkedShapes: any;
    activeLine: any;
    dataset: import("../..").Dataset;
    highlightedSequence: any;
    viewTransform: {
        camera: import("three").Camera;
        width: number;
        height: number;
    };
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
        distanceMetric: string;
    };
    projectionWorker: Worker;
    clusterMode: import("../Ducks/ClusterModeDuck").ClusterMode;
    displayMode: import("../Ducks/DisplayModeDuck").DisplayMode;
    lineBrightness: any;
    pathLengthRange: {
        range: any;
        maximum: number;
    } | {
        range: number[];
        maximum: any;
    };
    categoryOptions: import("..").CategoryOptions;
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
    lineUpInput: import("../Ducks/LineUpInputDuck").LineUpType;
    rdkitSettings: import("../Ducks/RDKitSettingsDuck").RDKitSettingsType;
    differenceThreshold: any;
    projections: import("../..").Embedding[];
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
}>;
export declare type RootState = ReturnType<typeof rootReducer>;
