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
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    domainSettings: any;
    open: boolean;
    onClose: any;
    onStart: any;
};
declare function GenericSettingsComp({ domainSettings, open, onClose, onStart, projectionParams, setProjectionParams, projectionColumns }: Props): JSX.Element;
export declare const GenericSettings: import("react-redux").ConnectedComponent<typeof GenericSettingsComp, import("react-redux").Omit<{
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
} & {
    domainSettings: any;
    open: boolean;
    onClose: any;
    onStart: any;
}, "projectionColumns" | "projectionParams" | "setProjectionParams">>;
export {};
