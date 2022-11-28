import { EntityId, EntityState } from '@reduxjs/toolkit';
import { ICluster } from '../../model/ICluster';
import { IEdge } from '../../model/Edge';
import { IBook } from '../../model/Book';
export declare const bookAdapter: import("@reduxjs/toolkit").EntityAdapter<IBook>;
export declare const edgeAdapter: import("@reduxjs/toolkit").EntityAdapter<IEdge>;
export declare const clusterAdapter: import("@reduxjs/toolkit").EntityAdapter<ICluster>;
export declare class AStorytelling {
    static createEmpty(): IStorytelling;
    static emptyStory(metadata?: any): IBook;
    static getActive(stories: IStorytelling): IBook;
    static retrieveCluster(stories: IStorytelling, clusterIndex: EntityId): ICluster;
    static retreiveEdge(stories: IStorytelling, edgeIndex: EntityId): IEdge;
}
/**
 * Type interface for stories slace of the redux store.
 */
export type IStorytelling = {
    stories: EntityState<IBook>;
    active: EntityId;
    trace: {
        mainPath: EntityId[];
        mainEdges: EntityId[];
        sidePaths: {
            nodes: EntityId[];
            edges: EntityId[];
            syncNodes: number[];
        }[];
    };
    activeTraceState: EntityId;
    groupLabel: {
        [key: number]: number[];
    };
};
export declare const StoriesActions: {
    changeClusterName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        cluster: EntityId;
        name: string;
    }, "stories/changeClusterName">;
    selectSideBranch: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, "stories/selectSideBranch">;
    addEdgeToActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IEdge, "stories/addEdgeToActive">;
    setActiveTraceState: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "stories/setActiveTraceState">;
    setActiveTrace: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "stories/setActiveTrace">;
    removeEdgeFromActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "stories/removeEdgeFromActive">;
    changeBookName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        id: EntityId;
        name: string;
    }, "stories/changeBookName">;
    addBookAsync: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        book: any;
        activate: any;
    }, "stories/addBookAsync">;
    addCluster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, "stories/addCluster">;
    deleteBookAsync: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "stories/deleteBookAsync">;
    deleteCluster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, "stories/deleteCluster">;
    setActiveStoryBook: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, "stories/setActiveStoryBook">;
    addClusterToTrace: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, "stories/addClusterToTrace">;
    set: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IBook[], "stories/set">;
};
export declare const stories: import("redux").Reducer<IStorytelling, import("redux").AnyAction>;
