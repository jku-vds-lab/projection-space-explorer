/* eslint-disable spaced-comment */
import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction, createAsyncThunk, EntityId, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { getSyncNodesAlt } from '../NumTs/NumTs';
import { ACluster } from '../../model/Cluster';
import { ICluster } from '../../model/ICluster';
import { IEdge } from '../../model/Edge';
import { IBook } from '../../model/Book';
import { ObjectTypes } from '../../model/ObjectType';
import type { RootState } from '../Store';
import { replaceClusterLabels } from '../WebGLView/UtilityFunctions';

export const bookAdapter = createEntityAdapter<IBook>({
  selectId: (book) => book.id,
});

export const edgeAdapter = createEntityAdapter<IEdge>({
  selectId: (edge) => edge.id,
});

export const clusterAdapter = createEntityAdapter<ICluster>({
  selectId: (cluster) => cluster.id,
});

export class AStorytelling {
  static createEmpty(): IStorytelling {
    return {
      stories: bookAdapter.getInitialState(),
      active: null,
      trace: null,
      activeTraceState: null,
    };
  }

  static emptyStory(metadata?): IBook {
    const story: IBook = {
      id: uuidv4(),
      clusters: clusterAdapter.getInitialState(),
      edges: edgeAdapter.getInitialState(),
      metadata: metadata ?? { method: 'custom' },
    };

    return story;
  }

  static getActive(stories: IStorytelling): IBook {
    if (stories && stories.stories) {
      return stories.stories.entities[stories.active];
    }

    return null;
  }

  static retrieveCluster(stories: IStorytelling, clusterIndex: EntityId): ICluster {
    return stories.stories.entities[stories.active].clusters.entities[clusterIndex];
  }

  static retreiveEdge(stories: IStorytelling, edgeIndex: EntityId): IEdge {
    return stories.stories.entities[stories.active].edges.entities[edgeIndex];
  }
}

const addBookAsync = createAsyncThunk('stories/addBook', async ({ book, activate }: { book: IBook; activate: boolean }, { getState }) => {
  const state = getState() as RootState;

  ACluster.deriveVectorLabelsFromClusters(state.dataset.vectors, Object.values(book.clusters.entities));

  return { book, activate };
});

const changeClusterName = createAsyncThunk('stories/changeClusterName', async ({ cluster, name }: { cluster: ICluster; name: string }, { getState }) => {
  const state = getState() as RootState;

  //ACluster.deriveVectorLabelsFromClusters(state.dataset.vectors, Object.values(book.clusters.entities));
  // Rename cluster labels in dataset
  replaceClusterLabels(
    cluster.indices.map((i) => state.dataset.vectors[i]),
    cluster.label,
    name,
  );

  return { handle: cluster.id, name };
});

const deleteBookAsync = createAsyncThunk('stories/deleteBook', async ({ book }: { book: EntityId }, { getState }) => {
  const state = getState() as RootState;

  if (state.stories.active === book) {
    ACluster.deriveVectorLabelsFromClusters(state.dataset.vectors, []);
  }

  return book;
});

const addCluster = createAsyncThunk('stories/addCluster', async ({ cluster }: { cluster: ICluster }, { getState }) => {
  const state = getState() as RootState;

  cluster.indices.forEach((i) => {
    const sample = state.dataset.vectors[i];
    if (Array.isArray(sample.groupLabel)) {
      sample.groupLabel.push(cluster.label);
    } else {
      sample.groupLabel = [cluster.label];
    }
  });

  return cluster;
});

const deleteCluster = createAsyncThunk('stories/deleteCluster', async ({ cluster }: { cluster: ICluster }, { getState }) => {
  const state = getState() as RootState;

  return { cluster, vectors: state.dataset.vectors };
});

const set = createAsyncThunk('stories/set', async ({ stories }: { stories: IBook[] }, { getState }) => {
  const state = getState() as RootState;

  return { stories, vectors: state.dataset.vectors };
});

const setActiveStoryBook = createAsyncThunk('stories/setactivestory', async ({ book }: { book: EntityId }, { getState }) => {
  const state = getState() as RootState;

  return { book, vectors: state.dataset.vectors };
});

const addClusterToTrace = createAsyncThunk('stories/addClusterToTrace', async ({ cluster }: { cluster: ICluster }, { getState }) => {
  const state = getState() as RootState;
  const { vectors } = state.dataset;
  const active = state.stories.stories.entities[state.stories.active];

  ACluster.deriveVectorLabelsFromClusters(vectors, [...Object.values(active.clusters.entities), cluster]);

  return { cluster };
});

const initialState = AStorytelling.createEmpty();

const bookSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    selectSideBranch(state, action: PayloadAction<number>) {
      const index = action.payload;

      const sidePath = { mainEdges: state.trace.mainEdges, mainPath: state.trace.mainPath };

      state.trace = {
        mainPath: state.trace.sidePaths[index].nodes,
        mainEdges: state.trace.sidePaths[index].edges,
        sidePaths: [...state.trace.sidePaths.slice(0, index), ...state.trace.sidePaths.slice(index + 1)],
      };

      state.trace.sidePaths.push({
        nodes: sidePath.mainPath,
        edges: sidePath.mainEdges,
        syncNodes: [],
      });

      state.trace.sidePaths.forEach((sidePath) => {
        sidePath.syncNodes = getSyncNodesAlt(state.trace.mainPath, sidePath.nodes);
      });

      state.activeTraceState = state.trace.mainPath[0];
    },
    addEdgeToActive(state, action: PayloadAction<IEdge>) {
      const active = state.stories.entities[state.active];
      edgeAdapter.addOne(active.edges, action.payload);
    },
    setActiveTraceState(state, action: PayloadAction<EntityId>) {
      state.activeTraceState = action.payload;
    },
    setActiveTrace(state, action: PayloadAction<any>) {
      state.trace = action.payload;
    },
    removeEdgeFromActive(state, action: PayloadAction<EntityId>) {
      const active = state.stories.entities[state.active];
      edgeAdapter.removeOne(active.edges, action.payload);
      if (state.trace?.mainEdges?.includes(action.payload)) {
        state.activeTraceState = null;
        state.trace = null;
      }
    },
    changeBookName(state, action: PayloadAction<{ id: EntityId; name: string }>) {
      const { id, name } = action.payload;
      bookAdapter.updateOne(state.stories, { id, changes: { name } });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBookAsync.fulfilled, (state, { payload }) => {
      const { book, activate } = payload;

      bookAdapter.addOne(state.stories, book);

      state.trace = null;
      state.activeTraceState = null;

      if (activate) {
        state.active = book.id;
      }
    });

    builder.addCase(changeClusterName.fulfilled, (state, { payload }) => {
      const story = state.stories.entities[state.active];
      story.clusters.entities[payload.handle].label = payload.name;
    });

    builder.addCase(addCluster.fulfilled, (state, { payload }) => {
      const active = state.stories.entities[state.active];

      clusterAdapter.addOne(active.clusters, payload);
    });

    builder.addCase(deleteCluster.fulfilled, (state, { payload }) => {
      const { cluster } = payload;

      const active = state.stories.entities[state.active];
      clusterAdapter.removeOne(active.clusters, payload.cluster.id);

      const entries = Object.entries(active.edges.entities).filter(([, edge]) => {
        return edge.source === payload.cluster.id || edge.destination === payload.cluster.id;
      });

      for (const [, edge] of entries) {
        edgeAdapter.removeOne(active.edges, edge.id);
      }

      if (state.trace?.mainPath?.includes(cluster.id)) {
        state.trace = null;
        state.activeTraceState = null;
      }

      // Remove cluster labels from samples
      // TODO: check if this is ok in a reducer
      payload.cluster.indices
        .map((i) => payload.vectors[i])
        .forEach((sample) => {
          if (Array.isArray(sample.groupLabel)) {
            sample.groupLabel.splice(sample.groupLabel.indexOf(payload.cluster.label), 1);
          } else {
            sample.groupLabel = [];
          }
        });
    });

    builder.addCase(setActiveStoryBook.fulfilled, (state, { payload }) => {
      const storyBook = state.stories.entities[payload.book];

      state.trace = null;
      state.activeTraceState = null;

      if (storyBook && storyBook.clusters) {
        ACluster.deriveVectorLabelsFromClusters(payload.vectors, Object.values(storyBook.clusters.entities));
        state.active = storyBook.id;
      } else {
        ACluster.deriveVectorLabelsFromClusters(payload.vectors, []);
        state.active = null;
      }
    });

    builder.addCase(addClusterToTrace.fulfilled, (state, { payload }) => {
      const { cluster } = payload;

      const active = state.stories.entities[state.active];
      clusterAdapter.addOne(active.clusters, cluster);

      // Add edge that connects the active trace state with the current cluster
      if (state.trace.mainPath.length > 0) {
        const edge: IEdge = {
          id: uuidv4(),
          source: state.trace.mainPath[state.trace.mainPath.length - 1],
          destination: cluster.id,
          objectType: ObjectTypes.Edge,
        };

        edgeAdapter.addOne(active.edges, edge);

        state.trace.mainEdges.push(edge.id);
      }

      // Add cluster to current trace
      state.trace.mainPath.push(cluster.id);
    });

    builder.addCase(deleteBookAsync.fulfilled, (state, { payload }) => {
      bookAdapter.removeOne(state.stories, payload);
      if (state.active === payload) {
        state.trace = null;
        state.activeTraceState = null;
      }
    });

    builder.addCase(set.fulfilled, (state, { payload }) => {
      bookAdapter.addMany(state.stories, payload.stories);
      const active = state.stories.entities[state.active];
      if (active) {
        ACluster.deriveVectorLabelsFromClusters(payload.vectors, Object.values(active.clusters.entities));
      }
    });
  },
});

/**
 * Type interface for stories slace of the redux store.
 */
export type IStorytelling = {
  stories: EntityState<IBook>;

  active: EntityId;

  trace: { mainPath: EntityId[]; mainEdges: EntityId[]; sidePaths: { nodes: EntityId[]; edges: EntityId[]; syncNodes: number[] }[] };

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

export const StoriesActions = {
  ...bookSlice.actions,
  addBookAsync,
  addCluster,
  deleteCluster,
  setActiveStoryBook,
  addClusterToTrace,
  deleteBookAsync,
  set,
  changeClusterName,
};
export const stories = bookSlice.reducer;
