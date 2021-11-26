import { ConnectedProps } from 'react-redux';
import { Dataset } from "../../model/Dataset";
import { IStorytelling } from "../Ducks/StoriesDuck";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: Dataset;
    stories: IStorytelling;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    genericFingerprintAttributes: any[];
} & {
    addClusterToTrace: (cluster: any) => any;
    setActiveTraceState: (cluster: string) => any;
    selectSideBranch: (index: number) => any;
    setActiveTrace: (trace: number) => any;
    setSelectedCluster: (clusters: string[], shift: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    dataset: Dataset;
};
export declare const Storytelling: import("react-redux").ConnectedComponent<({ dataset, stories, currentAggregation, addClusterToTrace, setActiveTraceState, setActiveTrace, selectSideBranch, setSelectedCluster }: Props) => JSX.Element, Pick<Props, never>>;
export {};
