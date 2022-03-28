import { ConnectedProps } from 'react-redux';
import './DatasetTabPanel.scss';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    genericFingerprintAttributes: any[];
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: import("@reduxjs/toolkit").EntityId[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../..").IBook;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
    setGenericFingerprintAttributes: (genericFingerprintAttributes: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare const DetailsTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook, genericFingerprintAttributes, setGenericFingerprintAttributes }: Props) => JSX.Element, Pick<{
    genericFingerprintAttributes: any[];
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: import("@reduxjs/toolkit").EntityId[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../..").IBook;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
    setGenericFingerprintAttributes: (genericFingerprintAttributes: any) => any;
}, never>>;
export {};
