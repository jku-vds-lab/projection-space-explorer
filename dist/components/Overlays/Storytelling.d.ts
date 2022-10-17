import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { Dataset } from '../../model/Dataset';
import { IStorytelling } from '../Ducks/StoriesDuck copy';
import { ICluster } from '../../model/ICluster';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: Dataset;
    stories: import("immer/dist/internal").WritableDraft<IStorytelling>;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    genericFingerprintAttributes: any[];
} & {
    addClusterToTrace: (cluster: ICluster) => any;
    setActiveTraceState: (cluster: EntityId) => any;
    selectSideBranch: (index: number) => any;
    setActiveTrace: (trace: number) => any;
    setSelectedCluster: (clusters: EntityId[], shift: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    dataset: Dataset;
};
export declare const Storytelling: import("react-redux").ConnectedComponent<({ dataset, stories, currentAggregation, addClusterToTrace, setActiveTraceState, setActiveTrace, selectSideBranch, setSelectedCluster, }: Props) => JSX.Element, import("react-redux").Omit<{
    dataset: Dataset;
    stories: import("immer/dist/internal").WritableDraft<IStorytelling>;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    genericFingerprintAttributes: any[];
} & {
    addClusterToTrace: (cluster: ICluster) => any;
    setActiveTraceState: (cluster: EntityId) => any;
    selectSideBranch: (index: number) => any;
    setActiveTrace: (trace: number) => any;
    setSelectedCluster: (clusters: EntityId[], shift: any) => any;
} & {
    dataset: Dataset;
}, "dataset" | "stories" | "selectSideBranch" | "setActiveTraceState" | "setActiveTrace" | "currentAggregation" | "genericFingerprintAttributes" | "addClusterToTrace" | "setSelectedCluster">>;
export {};
