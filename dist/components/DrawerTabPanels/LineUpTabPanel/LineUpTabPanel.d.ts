/// <reference types="react" />
import { ConnectedProps } from "react-redux";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../..").Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    lineUpInput: import("../../Ducks/LineUpInputDuck").LineUpType;
} & {
    setLineUpInput_visibility: (value: any) => any;
    setLineUpInput_filter: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    splitRef: any;
};
export declare const LineUpTabPanel: import("react-redux").ConnectedComponent<({ setLineUpInput_visibility, setLineUpInput_filter, lineUpInput, dataset, currentAggregation, splitRef }: Props) => JSX.Element, Pick<Props, "splitRef">>;
export {};
