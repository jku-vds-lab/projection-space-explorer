import { ConnectedProps } from 'react-redux';
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
    globalLabels: import("../..").GlobalLabelsState;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};
export declare const HoverTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, globalLabels }: Props) => JSX.Element, import("react-redux").Omit<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    globalLabels: import("../..").GlobalLabelsState;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
}, "globalLabels" | "currentAggregation" | "dataset" | "hoverSettings" | "setHoverWindowMode" | "setAggregation">>;
export {};
