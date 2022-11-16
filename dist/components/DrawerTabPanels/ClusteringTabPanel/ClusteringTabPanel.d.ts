import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { ICluster } from '../../../model/ICluster';
import { IBook } from '../../../model/Book';
import { DisplayMode } from '../../Ducks/DisplayModeDuck';
import { Dataset } from '../../../model/Dataset';
import { IStorytelling } from '../../Ducks/StoriesDuck';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("immer/dist/internal").WritableDraft<IStorytelling>;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("immer/dist/internal").WritableDraft<import("../../..").IProjection>;
} & {
    setStories: (stories: IBook[]) => any;
    setActiveStory: (book: EntityId) => any;
    setDisplayMode: (displayMode: any) => any;
    addStory: (book: IBook) => any;
    removeClusterFromStories: (cluster: ICluster) => any;
    setChannelColor: (col: any) => any;
    setGroupVisualizationMode: (groupVisualizationMode: any) => any;
    setSelectedClusters: (clusters: string[], shift: boolean) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    splitRef: any;
    baseUrl: string;
};
export declare const ClusteringTabPanel: import("react-redux").ConnectedComponent<({ setChannelColor, setStories, dataset, stories, setDisplayMode, displayMode, addStory, removeClusterFromStories, workspace, currentAggregation, splitRef, groupVisualizationMode, setGroupVisualizationMode, setSelectedClusters, baseUrl, }: Props) => JSX.Element, import("react-redux").Omit<{
    stories: import("immer/dist/internal").WritableDraft<IStorytelling>;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("immer/dist/internal").WritableDraft<import("../../..").IProjection>;
} & {
    setStories: (stories: IBook[]) => any;
    setActiveStory: (book: EntityId) => any;
    setDisplayMode: (displayMode: any) => any;
    addStory: (book: IBook) => any;
    removeClusterFromStories: (cluster: ICluster) => any;
    setChannelColor: (col: any) => any;
    setGroupVisualizationMode: (groupVisualizationMode: any) => any;
    setSelectedClusters: (clusters: string[], shift: boolean) => any;
} & {
    splitRef: any;
    baseUrl: string;
}, "dataset" | "stories" | "workspace" | "currentAggregation" | "displayMode" | "groupVisualizationMode" | "setGroupVisualizationMode" | "setChannelColor" | "setStories" | "setDisplayMode" | "addStory" | "removeClusterFromStories" | "setSelectedClusters" | "setActiveStory">>;
export {};
