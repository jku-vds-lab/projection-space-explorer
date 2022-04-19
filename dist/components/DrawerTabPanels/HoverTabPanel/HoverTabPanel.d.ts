import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: import("@reduxjs/toolkit").EntityId[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare const HoverTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset }: Props) => JSX.Element, Pick<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: import("@reduxjs/toolkit").EntityId[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
}, never>>;
export {};