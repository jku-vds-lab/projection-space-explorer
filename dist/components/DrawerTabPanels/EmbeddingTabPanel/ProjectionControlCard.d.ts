import { ConnectedProps } from 'react-redux';
import { EmbeddingController } from './EmbeddingController';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: import("../../../model/DistanceMetric").DistanceMetric; /**
         * Styles for the projection card that allows to stop/resume projection steps.
         */
        normalizationMethod: import("../../../model/NormalizationMethod").NormalizationMethod;
        encodingMethod: import("../../../model/EncodingMethod").EncodingMethod;
    };
    worker: Worker;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    onClose: any;
    onComputingChanged: any;
    controller: EmbeddingController;
    dataset_name: string;
    onStep?: any;
};
/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export declare const ProjectionControlCard: import("react-redux").ConnectedComponent<({ onComputingChanged, projectionParams, controller, onClose, dataset_name, onStep }: Props) => JSX.Element, import("react-redux").Omit<{
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: import("../../../model/DistanceMetric").DistanceMetric; /**
         * Styles for the projection card that allows to stop/resume projection steps.
         */
        normalizationMethod: import("../../../model/NormalizationMethod").NormalizationMethod;
        encodingMethod: import("../../../model/EncodingMethod").EncodingMethod;
    };
    worker: Worker;
} & {
    onClose: any;
    onComputingChanged: any;
    controller: EmbeddingController;
    dataset_name: string;
    onStep?: any;
}, "projectionParams" | "worker">>;
export {};
//# sourceMappingURL=ProjectionControlCard.d.ts.map