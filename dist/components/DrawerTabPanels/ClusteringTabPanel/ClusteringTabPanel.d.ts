import { EntityId } from '@reduxjs/toolkit';
import { ConnectedProps } from 'react-redux';
import { ICluster } from '../../../model/ICluster';
import { IBook } from '../../../model/Book';
import { DisplayMode } from '../../Ducks/DisplayModeDuck';
import { Dataset } from '../../../model/Dataset';
import { IStorytelling } from '../../Ducks/StoriesDuck copy';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: IStorytelling;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: EntityId[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("../../..").IBaseProjection;
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
};
export declare const ClusteringTabPanel: import("react-redux").ConnectedComponent<({ setChannelColor, setStories, dataset, stories, setDisplayMode, displayMode, addStory, removeClusterFromStories, workspace, currentAggregation, splitRef, groupVisualizationMode, setGroupVisualizationMode, setSelectedClusters, }: Props) => JSX.Element, Pick<Props, "splitRef">>;
export {};
