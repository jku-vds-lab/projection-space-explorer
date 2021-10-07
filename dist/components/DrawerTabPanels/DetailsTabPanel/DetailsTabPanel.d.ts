import { ConnectedProps } from "react-redux";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    dataset: import("../../../model").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../../model").IBook;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare const DetailsTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook }: Props) => JSX.Element, Pick<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    dataset: import("../../../model").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../../model").IBook;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
}, never>>;
export {};
