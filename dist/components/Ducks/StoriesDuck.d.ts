import { ICluster } from "../../model/Cluster";
import { IEdge } from "../../model/Edge";
import { IBook } from "../../model/Book";
declare const enum ActionTypes {
    ADD_BOOK = "ducks/stories/ADD",
    DELETE_BOOK = "ducks/stories/DELETE",
    ADD_CLUSTER = "ducks/stories/ADD_CLUSTER",
    DELETE_CLUSTER = "ducks/stories/REMOVE_CLUSTER_FROM_STORIES",
    SET = "ducks/stories/SET",
    SET_ACTIVE_STORY_BOOK = "ducks/stories/SET_ACTIVE",
    ADD_EDGE_TO_ACTIVE = "ducks/stories/ADD_EDGE_TO_ACTIVE",
    SET_ACTIVE_TRACE = "ducks/stories/SET_ACTIVE_TRACE",
    ADD_CLUSTER_TO_TRACE = "ducks/stories/ADD_CLUSTER_TO_TRACE",
    SET_ACTIVE_TRACE_STATE = "ducks/stories/SET_ACTIVE_TRACE_STATE",
    SELECT_SIDE_BRANCH = "ducks/stories/SELECT_SIDE_BRANCH",
    REMOVE_EDGE_FROM_ACTIVE = "ducks/stories/REMOVE_EDGE_FROM_ACTIVE"
}
/**type AddStoryAction = {
    type: ActionTypes.ADD_STORY_BOOK
    story: IBook
    activate: boolean
}**/
export declare function addBook(story: IBook, activate?: boolean): (dispatch: any, getState: any) => any;
export declare function deleteBook(story: IBook): (dispatch: any, getState: any) => any;
export declare function addCluster(cluster: ICluster): (dispatch: any, getState: any) => any;
export declare function deleteCluster(cluster: ICluster): (dispatch: any, getState: any) => any;
export declare function setStories(stories: IBook[]): (dispatch: any, getState: any) => any;
export declare function setActiveStory(activeStory: IBook): (dispatch: any, getState: any) => any;
export declare function addEdgeToActive(edge: any): {
    type: ActionTypes;
    edge: any;
};
export declare function removeEdgeFromActive(edge: any): {
    type: ActionTypes;
    edge: any;
};
export declare const setActiveTrace: (activeTrace: number) => {
    type: ActionTypes;
    activeTrace: number;
};
export declare const addClusterToTrace: (cluster: any) => (dispatch: any, getState: any) => any;
export declare function setActiveTraceState(cluster: string): {
    type: ActionTypes;
    cluster: string;
};
export declare function selectSideBranch(i: number): {
    type: ActionTypes;
    index: number;
};
export declare class AStorytelling {
    static createEmpty(): IStorytelling;
    static emptyStory(): IBook;
    static getActive(stories: IStorytelling): IBook;
    static retrieveCluster(stories: IStorytelling, clusterIndex: string): ICluster;
    static retreiveEdge(stories: IStorytelling, edgeIndex: string): IEdge;
}
/**
 * Type interface for stories slace of the redux store.
 */
export declare type IStorytelling = {
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
export default function stories(state: IStorytelling, action: any): IStorytelling;
export {};
