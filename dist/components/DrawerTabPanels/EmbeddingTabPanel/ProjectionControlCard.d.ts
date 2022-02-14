import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
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
    worker: Worker;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    onClose: any;
    onComputingChanged: any;
    controller: any;
    dataset_name: string;
};
/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export declare const ProjectionControlCard: import("react-redux").ConnectedComponent<({ onComputingChanged, projectionParams, controller, onClose, dataset_name }: Props) => JSX.Element, Pick<Props, "onClose" | "controller" | "onComputingChanged" | "dataset_name">>;
export {};
