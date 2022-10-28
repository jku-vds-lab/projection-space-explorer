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
export declare type IStorytelling = {
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
};
/**export default function stories(state: IStorytelling = initialState, action): IStorytelling {
  switch (action.type) {
    case ActionTypes.SELECT_SIDE_BRANCH: {
      const sidePaths = state.trace.sidePaths.slice(0);

      sidePaths.splice(action.index, 1);
      sidePaths.push({
        nodes: state.trace.mainPath,
        edges: state.trace.mainEdges,
        syncNodes: [],
      });

      const trace = {
        mainPath: state.trace.sidePaths[action.index].nodes,
        mainEdges: state.trace.sidePaths[action.index].edges,
        sidePaths,
      };

      trace.sidePaths.forEach((sidePath) => {
        sidePath.syncNodes = getSyncNodesAlt(trace.mainPath, sidePath.nodes);
      });

      return {
        stories: state.stories,
        active: state.active,
        trace,
        activeTraceState: state.activeTraceState,
      };
    }

  }
}**/
export declare const StoriesActions: {
    addBookAsync: import("@reduxjs/toolkit").AsyncThunk<{
        book: IBook;
        activate: boolean;
    }, {
        book: IBook;
        activate: boolean;
    }, {}>;
    addCluster: import("@reduxjs/toolkit").AsyncThunk<ICluster, {
        cluster: ICluster;
    }, {}>;
    deleteCluster: import("@reduxjs/toolkit").AsyncThunk<{
        cluster: ICluster;
        vectors: import("../..").IVector[];
    }, {
        cluster: ICluster;
    }, {}>;
    setActiveStoryBook: import("@reduxjs/toolkit").AsyncThunk<{
        book: EntityId;
        vectors: import("../..").IVector[];
    }, {
        book: EntityId;
    }, {}>;
    addClusterToTrace: import("@reduxjs/toolkit").AsyncThunk<{
        cluster: ICluster;
    }, {
        cluster: ICluster;
    }, {}>;
    deleteBookAsync: import("@reduxjs/toolkit").AsyncThunk<string | number, {
        book: EntityId;
    }, {}>;
    set: import("@reduxjs/toolkit").AsyncThunk<{
        stories: IBook[];
        vectors: import("../..").IVector[];
    }, {
        stories: IBook[];
    }, {}>;
    changeClusterName: import("@reduxjs/toolkit").AsyncThunk<{
        handle: EntityId;
        name: string;
    }, {
        cluster: ICluster;
        name: string;
    }, {}>;
    selectSideBranch: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
    addEdgeToActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IEdge, string>;
    setActiveTraceState: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    setActiveTrace: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
    removeEdgeFromActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    changeBookName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        id: EntityId;
        name: string;
    }, string>;
};
export declare const stories: import("redux").Reducer<import("immer/dist/internal").WritableDraft<IStorytelling>, import("redux").AnyAction>;
