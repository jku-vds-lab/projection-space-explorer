import { ConnectedProps } from 'react-redux';
import { ICluster } from "../../../model/Cluster";
import { IBook } from "../../../model/Book";
import { DisplayMode } from "../../Ducks/DisplayModeDuck";
import { IStorytelling } from "../../Ducks/StoriesDuck";
import { Dataset } from "../../../model/Dataset";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: IStorytelling;
    displayMode: DisplayMode;
    dataset: Dataset;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    groupVisualizationMode: any;
    workspace: import("../../..").IBaseProjection;
} & {
    setStories: (stories: IBook[]) => any;
    setActiveStory: (activeStory: IBook) => any;
    setDisplayMode: (displayMode: any) => any;
    addStory: (story: any) => any;
    removeClusterFromStories: (cluster: ICluster) => any;
    setChannelColor: (col: any) => any;
    setGroupVisualizationMode: (groupVisualizationMode: any) => any;
    setSelectedClusters: (clusters: string[], shift: boolean) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    splitRef: any;
};
export declare const ClusteringTabPanel: import("react-redux").ConnectedComponent<({ setChannelColor, setStories, dataset, stories, setDisplayMode, displayMode, addStory, removeClusterFromStories, workspace, currentAggregation, splitRef, groupVisualizationMode, setGroupVisualizationMode, setSelectedClusters }: Props) => JSX.Element, Pick<Props, "splitRef">>;
export {};
