import { ConnectedProps } from 'react-redux';
import { Dataset } from '../../../model/Dataset';
import { IProjection, IBaseProjection } from '../../../model/ProjectionInterfaces';
import { FeatureConfig } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../../Ducks").IStorytelling;
    projectionWorker: Worker;
    projectionOpen: any;
    dataset: Dataset;
    projections: import("@reduxjs/toolkit").EntityState<IProjection>;
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
    updateWorkspace: (workspace: IBaseProjection, metadata?: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    config: FeatureConfig;
    projectionWorker?: Worker;
    projectionOpen?: boolean;
    setProjectionOpen?: any;
    setProjectionWorker?: any;
    dataset?: Dataset;
};
export declare const EmbeddingTabPanel: import("react-redux").ConnectedComponent<(props: Props) => JSX.Element, import("react-redux").Omit<{
    stories: import("../../Ducks").IStorytelling;
    projectionWorker: Worker;
    projectionOpen: any;
    dataset: Dataset;
    projections: import("@reduxjs/toolkit").EntityState<IProjection>;
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
    updateWorkspace: (workspace: IBaseProjection, metadata?: any) => any;
} & {
    config: FeatureConfig;
    projectionWorker?: Worker;
    projectionOpen?: boolean;
    setProjectionOpen?: any;
    setProjectionWorker?: any;
    dataset?: Dataset;
}, "stories" | "dataset" | "projectionOpen" | "projectionParams" | "projectionWorker" | "projections" | "setProjectionOpen" | "setProjectionWorker" | "setProjectionColumns" | "setTrailVisibility" | "addProjection" | "deleteProjection" | "updateWorkspace">>;
export {};
//# sourceMappingURL=EmbeddingTabPanel.d.ts.map