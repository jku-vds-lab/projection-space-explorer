import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    hoverState: import("..").HoverStateType;
    dataset: import("../..").Dataset;
    hoverSettings: {
        windowMode: any;
    };
} & {
    setHoverWindowMode: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux;
export declare const SelectionClusters: import("react-redux").ConnectedComponent<({ dataset, currentAggregation, hoverState, hoverSettings, setHoverWindowMode }: Props) => JSX.Element, import("react-redux").Omit<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    hoverState: import("..").HoverStateType;
    dataset: import("../..").Dataset;
    hoverSettings: {
        windowMode: any;
    };
} & {
    setHoverWindowMode: (value: any) => any;
}, "dataset" | "currentAggregation" | "hoverState" | "hoverSettings" | "setHoverWindowMode">>;
export {};
