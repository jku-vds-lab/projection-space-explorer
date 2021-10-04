import { ICluster } from "../../model/Cluster";
import { IEdge } from "../../model/Edge";
import { IBook } from "../../model/Book";
import { IVector } from "../../model/Vector";
export declare const addStory: (story: any, activate?: boolean) => {
    type: string;
    story: any;
    activate: boolean;
};
export declare const deleteStory: (story: any) => {
    type: string;
    story: any;
};
export declare function setStories(stories: IBook[]): {
    type: string;
    stories: IBook[];
};
export declare const addClusterToStory: (cluster: any) => {
    type: string;
    cluster: any;
};
export declare function setActiveStory(activeStory: IBook): {
    type: string;
    activeStory: IBook;
};
export declare function removeClusterFromStories(cluster: ICluster): {
    type: string;
    cluster: ICluster;
};
export declare function addEdgeToActive(edge: any): {
    type: string;
    edge: any;
};
export declare function removeEdgeFromActive(edge: any): {
    type: string;
    edge: any;
};
export declare const setActiveTrace: (activeTrace: number) => {
    type: string;
    activeTrace: number;
};
export declare const addClusterToTrace: (cluster: any) => {
    type: string;
    cluster: any;
};
export declare function setActiveTraceState(cluster: string): {
    type: string;
    cluster: string;
};
export declare function selectSideBranch(i: number): {
    type: string;
    index: number;
};
export declare function setVectors(vectors: IVector[]): {
    type: string;
    vectors: IVector[];
};
export declare class StoriesUtil {
    static createEmpty(): StoriesType;
    static emptyStory(): IBook;
    static getActive(stories: StoriesType): IBook;
    static retrieveCluster(stories: StoriesType, clusterIndex: string): ICluster;
    static retreiveEdge(stories: StoriesType, edgeIndex: string): IEdge;
}
/**
 * Type interface for stories slace of the redux store.
 */
export declare type StoriesType = {
    vectors: IVector[];
    stories: IBook[];
    active: number;
    trace: {
        mainPath: string[];
        mainEdges: string[];
        sidePaths: {
            nodes: string[];
            edges: string[];
            syncNodes: number[];
        }[];
    };
    activeTraceState: string;
};
export default function stories(state: StoriesType, action: any): StoriesType;
