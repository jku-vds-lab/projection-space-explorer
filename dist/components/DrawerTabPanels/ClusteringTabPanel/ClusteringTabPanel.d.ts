import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { ICluster } from '../../../model/ICluster';
import { IBook } from '../../../model/Book';
import { DisplayMode } from '../../Ducks/DisplayModeDuck';
import { Dataset } from '../../../model/Dataset';
import { IStorytelling } from '../../Ducks/StoriesDuck';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: IStorytelling;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("../../..").IProjection;
    globalLabels: import("../../Ducks").GlobalLabelsState;
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
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    splitRef: any;
    baseUrl: string;
};
export declare const ClusteringTabPanel: import("react-redux").ConnectedComponent<({ setChannelColor, setStories, dataset, stories, setDisplayMode, displayMode, addStory, removeClusterFromStories, workspace, currentAggregation, splitRef, groupVisualizationMode, setGroupVisualizationMode, setSelectedClusters, baseUrl, globalLabels, }: Props) => JSX.Element, import("react-redux").Omit<{
    stories: IStorytelling;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("../../..").IProjection;
    globalLabels: import("../../Ducks").GlobalLabelsState;
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
}, "dataset" | "stories" | "globalLabels" | "currentAggregation" | "displayMode" | "groupVisualizationMode" | "setGroupVisualizationMode" | "workspace" | "setChannelColor" | "setStories" | "setDisplayMode" | "addStory" | "removeClusterFromStories" | "setSelectedClusters" | "setActiveStory">>;
export {};
//# sourceMappingURL=ClusteringTabPanel.d.ts.map