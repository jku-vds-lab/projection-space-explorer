import { ConnectedProps } from 'react-redux';
import { DistanceMetric } from '../../../model/DistanceMetric';
import { NormalizationMethod } from '../../../model/NormalizationMethod';
import { EncodingMethod } from '../../../model/EncodingMethod';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionColumns: any;
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: DistanceMetric;
        normalizationMethod: NormalizationMethod;
        encodingMethod: EncodingMethod;
    };
} & {
    setProjectionParams: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    domainSettings: any;
    open: boolean;
    onClose: any;
    onStart: any;
};
export declare const GenericSettings: import("react-redux").ConnectedComponent<({ domainSettings, open, onClose, onStart, projectionParams, setProjectionParams, projectionColumns }: Props) => JSX.Element, Pick<Props, "open" | "onClose" | "domainSettings" | "onStart">>;
export {};
