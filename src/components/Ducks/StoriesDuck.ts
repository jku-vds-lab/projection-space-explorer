/* eslint-disable spaced-comment */
import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction, EntityId, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { getSyncNodesAlt } from '../NumTs/NumTs';
import { ICluster } from '../../model/ICluster';
import { IEdge } from '../../model/Edge';
import { IBook } from '../../model/Book';
import { ObjectTypes } from '../../model/ObjectType';

export const bookAdapter = createEntityAdapter<IBook>({
  selectId: (book) => book.id,
});

export const edgeAdapter = createEntityAdapter<IEdge>({
  selectId: (edge) => edge.id,
});

export const clusterAdapter = createEntityAdapter<ICluster>({
  selectId: (cluster) => cluster.id,
  sortComparer: (a, b) => {
    return b.indices.length - a.indices.length;
  },
});

function createGroupLabels(clusters: ICluster[]) {
  const groupLabels: { [key: number]: number[] } = {};

  // Create new labels from clusters
  clusters.forEach((cluster) => {
    cluster.indices.forEach((label) => {
      const labelGroup = groupLabels[label];
      if (labelGroup) {
        labelGroup.push(cluster.label);
      } else {
        groupLabels[label] = [cluster.label];
      }
    });
  });

  return groupLabels;
}

export class AStorytelling {
  static createEmpty(): IStorytelling {
    return {
      stories: bookAdapter.getInitialState(),
      active: null,
      trace: null,
      activeTraceState: null,
      groupLabel: {},
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

const initialState = AStorytelling.createEmpty();

const bookSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    changeClusterName(state, action: PayloadAction<{ cluster: EntityId; name: string }>) {
      const { name, cluster } = action.payload;
      const story = state.stories.entities[state.active];
      const entity = story.clusters.entities[cluster];
      entity.label = name;

      state.groupLabel = createGroupLabels(Object.values(story.clusters.entities));
    },
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
    addBookAsync(state, action: PayloadAction<{ book; activate }>) {
      const { book, activate } = action.payload;

      bookAdapter.addOne(state.stories, book);

      state.trace = null;
      state.activeTraceState = null;

      if (activate) {
        state.active = book.id;
      }

      state.groupLabel = createGroupLabels(Object.values(book.clusters.entities));
    },
    addCluster(state, action: PayloadAction<ICluster>) {
      const active = state.stories.entities[state.active];

      action.payload.indices.forEach((i) => {
        if (Array.isArray(state.groupLabel[i])) {
          state.groupLabel[i].push(action.payload.label);
        } else {
          state.groupLabel[i] = [action.payload.label];
        }
      });

      clusterAdapter.addOne(active.clusters, action.payload);
    },
    deleteBookAsync(state, action: PayloadAction<EntityId>) {
      bookAdapter.removeOne(state.stories, action.payload);
      if (state.active === action.payload) {
        state.trace = null;
        state.activeTraceState = null;
      }

      state.groupLabel = createGroupLabels([]);
    },

    deleteCluster(state, action: PayloadAction<ICluster>) {
      const active = state.stories.entities[state.active];
      clusterAdapter.removeOne(active.clusters, action.payload.id);

      const entries = Object.entries(active.edges.entities).filter(([, edge]) => {
        return edge.source === action.payload.id || edge.destination === action.payload.id;
      });

      for (const [, edge] of entries) {
        edgeAdapter.removeOne(active.edges, edge.id);
      }

      if (state.trace?.mainPath?.includes(action.payload.id)) {
        state.trace = null;
        state.activeTraceState = null;
      }

      action.payload.indices.forEach((vectorIndex) => {
        if (Array.isArray(state.groupLabel[vectorIndex])) {
          state.groupLabel[vectorIndex].splice(state.groupLabel[vectorIndex].indexOf(action.payload.label), 1);
        }
      });
    },

    setActiveStoryBook(state, action: PayloadAction<EntityId>) {
      const storyBook = state.stories.entities[action.payload];

      state.trace = null;
      state.activeTraceState = null;

      if (storyBook && storyBook.clusters) {
        state.groupLabel = createGroupLabels(Object.values(storyBook.clusters.entities));
        state.active = storyBook.id;
      } else {
        state.groupLabel = createGroupLabels([]);
        state.active = null;
      }
    },

    addClusterToTrace(state, action: PayloadAction<ICluster>) {
      const active = state.stories.entities[state.active];
      clusterAdapter.addOne(active.clusters, action.payload);

      // Add edge that connects the active trace state with the current cluster
      if (state.trace.mainPath.length > 0) {
        const edge: IEdge = {
          id: uuidv4(),
          source: state.trace.mainPath[state.trace.mainPath.length - 1],
          destination: action.payload.id,
          objectType: ObjectTypes.Edge,
        };

        edgeAdapter.addOne(active.edges, edge);

        state.trace.mainEdges.push(edge.id);
      }

      // Add cluster to current trace
      state.trace.mainPath.push(action.payload.id);

      // Generate group labels
      state.groupLabel = createGroupLabels(Object.values(active.clusters.entities));
    },
    set(state, action: PayloadAction<IBook[]>) {
      bookAdapter.addMany(state.stories, action.payload);
      const active = state.stories.entities[state.active];
      if (active) {
        state.groupLabel = createGroupLabels(Object.values(active.clusters.entities));
      }
    },
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

  groupLabel: { [key: number]: number[] };
};

export const StoriesActions = {
  ...bookSlice.actions,
};
export const stories = bookSlice.reducer;
