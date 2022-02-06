import { ConnectedProps } from 'react-redux';
import { Dataset } from '../../../model/Dataset';
import { IBaseProjection } from '../../../model/ProjectionInterfaces';
import { FeatureConfig } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../..").IStorytelling;
    projectionWorker: Worker;
    projectionOpen: any;
    dataset: Dataset;
    projections: import("../../Ducks/ProjectionDuck").ProjectionStateType;
    workspace: IBaseProjection;
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: import("../../../model/DistanceMetric").DistanceMetric;
        normalizationMethod: import("../../../model/NormalizationMethod").NormalizationMethod;
        encodingMethod: import("../../../model/EncodingMethod").EncodingMethod;
    };
} & {
    setProjectionOpen: (value: any) => any;
    setProjectionWorker: (value: any) => any;
    setProjectionColumns: (value: any) => any;
    setTrailVisibility: (visibility: any) => any;
    addProjection: (embedding: any) => any;
    deleteProjection: (handle: string) => any;
    updateWorkspace: (workspace: IBaseProjection) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    config: FeatureConfig;
    projectionWorker?: Worker;
    projectionOpen?: boolean;
    setProjectionOpen?: any;
    setProjectionWorker?: any;
    dataset?: Dataset;
    webGLView?: any;
};
export declare const EmbeddingTabPanel: import("react-redux").ConnectedComponent<(props: Props) => JSX.Element, Pick<Props, "config" | "webGLView">>;
export {};
