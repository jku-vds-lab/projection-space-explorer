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
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
export declare const SelectionClusters: import("react-redux").ConnectedComponent<({ dataset, currentAggregation, hoverState, hoverSettings, setHoverWindowMode }: Props) => import("react/jsx-runtime").JSX.Element, import("react-redux").Omit<{
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
}, "currentAggregation" | "dataset" | "hoverState" | "hoverSettings" | "setHoverWindowMode">>;
export {};
//# sourceMappingURL=SelectionClusters.d.ts.map