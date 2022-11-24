import { EntityId } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import type { RootState } from '../Store/Store';
import { ICluster } from '../../model/ICluster';
import { IVector } from '../../model/Vector';
import { AStorytelling } from './StoriesDuck';

const THUNK_SET_VECTORS = 'ducks/THUNK_SET_VECTORS';
const THUNK_SET_CLUSTERS = 'ducks/THUNK_SET_CLUSTERS';

function deriveFromClusters(clusters: ICluster[]): number[] {
  const agg = clusters.map((cluster) => cluster.indices).flat();
  return [...new Set(agg)];
}

function deriveFromSamples(samples: IVector[], clusters: { [id: string]: ICluster }): number[] {
  if (!clusters) {
    return [];
  }

  const labels = new Set();

  samples.forEach((sample) => {
    sample.groupLabel.forEach((label) => {
      labels.add(label);
    });
  });

  const arr = Array.from(labels);
  const result = [];

  for (const [key, cluster] of Object.entries(clusters)) {
    if (arr.includes(cluster.label)) {
      result.push(key);
    }
  }

  return result;
}

export const selectVectors = (selection: number[], shiftKey = false) => {
  return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
    const state: RootState = getState();

    const clusters = AStorytelling.getActive(state.stories)?.clusters.entities;

    let newSelection = [];

    if (shiftKey) {
      const selectionSet = new Set(state.currentAggregation.aggregation);

      selection.forEach((index) => {
        if (selectionSet.has(index)) {
          selectionSet.delete(index);
        } else {
          selectionSet.add(index);
        }
      });

      newSelection = [...selectionSet];
    } else {
      newSelection = [...selection];
    }

    return dispatch({
      type: THUNK_SET_VECTORS,
      clusterSelection: deriveFromSamples(
        newSelection.map((i) => state.dataset.vectors[i]),
        clusters,
      ),
      vectorSelection: newSelection,
    });
  };
};

export const selectClusters = (selection: (number | string)[], shiftKey = false) => {
  return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
    const state: RootState = getState();

    let newSelection = [];

    if (shiftKey) {
      const selectionSet = new Set<EntityId>(state.currentAggregation.selectedClusters);

      selection.forEach((index) => {
        if (selectionSet.has(index)) {
          selectionSet.delete(index);
        } else {
          selectionSet.add(index);
        }
      });

      newSelection = [...selectionSet];
    } else {
      newSelection = [...selection];
    }

    return dispatch({
      type: THUNK_SET_CLUSTERS,
      clusterSelection: newSelection,
      vectorSelection: deriveFromClusters(newSelection.map((i) => AStorytelling.getActive(state.stories).clusters.entities[i])),
    });
  };
};

const initialState = {
  aggregation: [] as number[],
  selectedClusters: [] as (number | string)[],
  source: 'sample' as 'sample' | 'cluster',
};

const currentAggregation = (state = initialState, action): typeof initialState => {
  switch (action.type) {
    case THUNK_SET_VECTORS: {
      return {
        aggregation: action.vectorSelection,
        selectedClusters: action.clusterSelection,
        source: 'sample',
      };
    }
    case THUNK_SET_CLUSTERS: {
      return {
        aggregation: action.vectorSelection,
        selectedClusters: action.clusterSelection,
        source: 'cluster',
      };
    }
    default:
      return state;
  }
};

export default currentAggregation;
