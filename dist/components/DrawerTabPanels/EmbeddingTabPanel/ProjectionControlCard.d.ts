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
};
/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export declare var ProjectionControlCard: import("react-redux").ConnectedComponent<({ onComputingChanged, projectionParams, controller, onClose }: Props) => JSX.Element, Pick<Props, "onClose" | "controller" | "onComputingChanged">>;
export {};
