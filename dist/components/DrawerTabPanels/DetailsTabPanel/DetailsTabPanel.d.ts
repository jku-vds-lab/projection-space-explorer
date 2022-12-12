import { ConnectedProps } from 'react-redux';
import { FeatureConfig } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
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
    genericFingerprintAttributes: any[];
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
export declare const DetailsTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook, config, setGenericFingerprintAttributes, genericFingerprintAttributes, }: Props) => JSX.Element, import("react-redux").Omit<{
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
    genericFingerprintAttributes: any[];
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
} & {
    config: FeatureConfig;
}, "currentAggregation" | "dataset" | "hoverSettings" | "genericFingerprintAttributes" | "hoverStateOrientation" | "setHoverWindowMode" | "setAggregation" | "setHoverStateOrientation" | "activeStorybook" | "setGenericFingerprintAttributes">>;
declare const attributeConnector: import("react-redux").InferableComponentEnhancerWithProps<{}, {}>;
type AttributesType = {
    feature: string;
    show: boolean;
}[];
type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>;
type AttributeTableProps = AttributeTablePropsFromRedux & {
    config: FeatureConfig;
    attributes: AttributesType;
    setAttributes: (AttributesType: any) => void;
};
export declare const AttributeTable: import("react-redux").ConnectedComponent<({ config, attributes, setAttributes }: AttributeTableProps) => JSX.Element, import("react-redux").Omit<{
    config: FeatureConfig;
    attributes: AttributesType;
    setAttributes: (AttributesType: any) => void;
}, never>>;
export {};
