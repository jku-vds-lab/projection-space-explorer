import { ConnectedProps } from 'react-redux';
import { Dataset } from "../../../model/Dataset";
import { Embedding } from '../../../model/Embedding';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    stories: import("../..").StoriesType;
    projectionWorker: Worker;
    projectionOpen: any;
    dataset: Dataset;
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
    projections: Embedding[];
} & {
    setProjectionOpen: (value: any) => any;
    setProjectionWorker: (value: any) => any;
    setProjectionParams: (value: any) => any;
    setProjectionColumns: (value: any) => any;
    setTrailVisibility: (visibility: any) => any;
    addProjection: (embedding: any) => any;
    deleteProjection: (projection: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    projectionWorker?: Worker;
    projectionOpen?: boolean;
    setProjectionOpen?: any;
    setProjectionWorker?: any;
    dataset?: Dataset;
    webGLView?: any;
};
export declare const EmbeddingTabPanel: import("react-redux").ConnectedComponent<(props: Props) => JSX.Element, Pick<Props, "webGLView">>;
export {};
