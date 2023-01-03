import { ConnectedProps } from 'react-redux';
import './DatasetTabPanel.scss';
import { FeatureConfig } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    genericFingerprintAttributes: any[];
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../..").IBook;
    globalLabels: import("../../Ducks").GlobalLabelsState;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    config: FeatureConfig;
};
export declare const DetailsTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook, globalLabels, genericFingerprintAttributes, setGenericFingerprintAttributes }: Props) => JSX.Element, import("react-redux").Omit<{
    genericFingerprintAttributes: any[];
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../..").IBook;
    globalLabels: import("../../Ducks").GlobalLabelsState;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
} & {
    config: FeatureConfig;
}, "globalLabels" | "currentAggregation" | "dataset" | "hoverSettings" | "genericFingerprintAttributes" | "hoverStateOrientation" | "setHoverWindowMode" | "setAggregation" | "setHoverStateOrientation" | "activeStorybook" | "setGenericFingerprintAttributes">>;
export {};
//# sourceMappingURL=DetailsTabPanel.d.ts.map