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
    }, string>;
    selectSideBranch: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
    addEdgeToActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IEdge, string>;
    setActiveTraceState: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    setActiveTrace: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
    removeEdgeFromActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    changeBookName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        id: EntityId;
        name: string;
    }, string>;
    addBookAsync: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        book: any;
        activate: any;
    }, string>;
    addCluster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, string>;
    deleteBookAsync: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    deleteCluster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, string>;
    setActiveStoryBook: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    addClusterToTrace: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ICluster, string>;
    set: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IBook[], string>;
};
export declare const stories: import("redux").Reducer<IStorytelling, import("redux").AnyAction>;
