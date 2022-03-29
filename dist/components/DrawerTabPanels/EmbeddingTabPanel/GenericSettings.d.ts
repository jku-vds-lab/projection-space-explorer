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
    columns: {
        [name: string]: {
            distinct: any;
            isNumeric: boolean;
            metaInformation: any;
            featureType: import("../../../model").FeatureType;
            range: any;
            featureLabel: string;
            project: boolean;
        };
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
declare function GenericSettingsComp({ domainSettings, open, onClose, onStart, projectionParams, setProjectionParams, projectionColumns, columns }: Props): JSX.Element;
export declare const GenericSettings: import("react-redux").ConnectedComponent<typeof GenericSettingsComp, Pick<Props, "open" | "onClose" | "domainSettings" | "onStart">>;
export {};
