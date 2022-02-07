import { v4 as uuidv4 } from 'uuid';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import clone = require('fast-clone');
import projectionOpen from '../Ducks/ProjectionOpenDuck';
import highlightedSequence from '../Ducks/HighlightedSequenceDuck';
import dataset from '../Ducks/DatasetDuck';
import openTab from '../Ducks/OpenTabDuck';
import clusterMode, { ClusterMode } from '../Ducks/ClusterModeDuck';
import advancedColoringSelection from '../Ducks/AdvancedColoringSelectionDuck';
import projectionColumns from '../Ducks/ProjectionColumnsDuck';
import displayMode from '../Ducks/DisplayModeDuck';
import lineBrightness from '../Ducks/LineBrightnessDuck';
import activeLine from '../Ducks/ActiveLineDuck';
import currentAggregation from '../Ducks/AggregationDuck';
import { viewTransform } from '../Ducks/ViewTransformDuck';
import projectionParams from '../Ducks/ProjectionParamsDuck';
import projectionWorker from '../Ducks/ProjectionWorkerDuck';
import vectorByShape from '../Ducks/VectorByShapeDuck';
import selectedVectorByShape from '../Ducks/SelectedVectorByShapeDuck';
import pathLengthRange from '../Ducks/PathLengthRange';
import channelSize from '../Ducks/ChannelSize';
import channelColor from '../Ducks/ChannelColorDuck';
import globalPointSize from '../Ducks/GlobalPointSizeDuck';
import pointColorScale from '../Ducks/PointColorScaleDuck';
import pointColorMapping from '../Ducks/PointColorMappingDuck';
import trailSettings from '../Ducks/TrailSettingsDuck';
import { differenceThreshold } from '../Ducks/DifferenceThresholdDuck';
import hoverSettings from '../Ducks/HoverSettingsDuck';
import hoverState from '../Ducks/HoverStateDuck';
import { selectedLineBy } from '../Ducks/SelectedLineByDuck';
import globalPointBrightness from '../Ducks/GlobalPointBrightnessDuck';
import channelBrightness from '../Ducks/ChannelBrightnessDuck';
import groupVisualizationMode, { GroupVisualizationMode } from '../Ducks/GroupVisualizationMode';
import genericFingerprintAttributes from '../Ducks/GenericFingerprintAttributesDuck';
import hoverStateOrientation from '../Ducks/HoverStateOrientationDuck';
import detailView from '../Ducks/DetailViewDuck';
import datasetEntries from '../Ducks/DatasetEntriesDuck';
import { embeddings, ProjectionStateType } from '../Ducks/ProjectionDuck';
import { RootActionTypes } from './RootActions';
import { Dataset, ADataset, SegmentFN, AProjection, IBook } from '../../model';
import { CategoryOptionsAPI } from '../WebGLView/CategoryOptions';
import { ANormalized } from '../Utility/NormalizedState';
import { storyLayout, graphLayout, transformIndicesToHandles } from '../Utility/graphs';
import colorScales from '../Ducks/ColorScalesDuck';
import { BaseColorScale } from '../../model/Palette';
import { PointDisplayReducer } from '../Ducks/PointDisplayDuck';
import { stories, IStorytelling, AStorytelling } from '../Ducks/StoriesDuck copy';

const allReducers = {
  currentAggregation,
  stories,
  openTab,
  selectedVectorByShape,
  vectorByShape,
  pointDisplay: PointDisplayReducer,
  activeLine,
  dataset,
  highlightedSequence,
  viewTransform,
  advancedColoringSelection,
  projectionColumns,
  projectionOpen,
  projectionParams,
  projectionWorker,
  clusterMode,
  displayMode,
  lineBrightness,
  pathLengthRange,
  channelSize,
  channelColor,
  channelBrightness,
  globalPointSize,
  hoverState,
  pointColorScale,
  pointColorMapping,
  trailSettings,
  differenceThreshold,
  projections: embeddings,
  hoverSettings,
  selectedLineBy,
  globalPointBrightness,
  groupVisualizationMode,
  genericFingerprintAttributes,
  hoverStateOrientation,
  detailView,
  datasetEntries,
  colorScales,
};

const bookAdapter = createEntityAdapter<IBook>({
  selectId: (book) => book.id,
});

const appReducer = combineReducers(allReducers);

export function createInitialReducerState(dataset: Dataset): Partial<RootState> {
  const clusterMode = dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate;
  const groupVisualizationMode = dataset.multivariateLabels ? GroupVisualizationMode.StarVisualization : GroupVisualizationMode.ConvexHull;

  // this.finite(dataset)

  const categoryOptions = dataset.categories;

  const pathLengthRange = {
    range: [0, SegmentFN.getMaxPathLength(dataset)],
    maximum: SegmentFN.getMaxPathLength(dataset),
  };

  const initialProjection = AProjection.createProjection(
    dataset.vectors.map((vector) => ({ x: vector.x, y: vector.y })),
    'Initial Projection',
  );

  const projections: ProjectionStateType = {
    values: {
      entities: { [initialProjection.hash]: initialProjection },
      ids: [initialProjection.hash],
    },
    workspace: undefined,
  };

  projections.workspace = {
    positions: initialProjection.positions,
    metadata: { method: 'dataset' },
    hash: uuidv4(),
    name: '',
  };

  const genericFingerprintAttributes = ADataset.getColumns(dataset, true).map((column) => ({
    feature: column,
    show: dataset.columns[column].project,
  }));

  const formatRange = (range) => {
    try {
      return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`;
    } catch {
      return 'unknown';
    }
  };

  const projectionColumns = ADataset.getColumns(dataset, true).map((column) => ({
    name: column,
    checked: dataset.columns[column].project,
    normalized: true,
    range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : 'unknown',
    featureLabel: dataset.columns[column].featureLabel,
  }));

  const defaultSizeAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, 'size', 'multiplicity', 'sequential');

  let globalPointSize;
  let channelSize;

  if (defaultSizeAttribute) {
    globalPointSize = [1, 2];
    channelSize = defaultSizeAttribute;
  } else {
    globalPointSize = [1];
    channelSize = null;
  }

  let channelColor;

  const defaultColorAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, 'color', 'algo', 'categorical');
  if (defaultColorAttribute) {
    channelColor = defaultColorAttribute;
  } else {
    channelColor = null;
  }

  const defaultBrightnessAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, 'transparency', 'age', 'sequential');
  let channelBrightness;
  let globalPointBrightness;

  if (defaultBrightnessAttribute) {
    globalPointBrightness = [0.25, 1];
    channelBrightness = defaultBrightnessAttribute;
  } else {
    globalPointBrightness = [1];
    channelBrightness = null;
  }

  let stories: IStorytelling;
  if (dataset.clusters && dataset.clusters.length > 0) {
    const { clusters } = dataset;

    if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
      const story = transformIndicesToHandles(dataset.clusters, dataset.clusterEdges);
      const init = bookAdapter.getInitialState();
      init.entities = {
        [story.id]: story,
      };
      init.ids = [story.id];

      stories = {
        stories: init,
        active: null,
        trace: null,
        activeTraceState: null,
      };
    } else if (dataset.isSequential) {
      console.log('getting edges');
      const [edges] = graphLayout(dataset, clusters);
      console.log(edges);
      if (edges.length > 0) {
        const storyArr = storyLayout(clusters, edges);

        const init = bookAdapter.getInitialState();
        init.entities = storyArr.reduce((prev, cur) => {
          prev[cur.id] = cur;
          return prev;
        }, {});
        init.ids = Object.keys(init.entities);

        stories = {
          stories: init,
          active: null,
          trace: null,
          activeTraceState: null,
        };
      }
    }
  } else {
    stories = AStorytelling.createEmpty();
  }

  const colorScalesState = clone(colorScales());
  if (channelColor) {
    const handle = ANormalized.entries<BaseColorScale>(colorScalesState.scales).find(([, value]) => {
      return value.type === channelColor.type;
    })[0];

    colorScalesState.active = handle;
  }

  return {
    clusterMode,
    groupVisualizationMode,
    projections,
    pathLengthRange,
    genericFingerprintAttributes,
    projectionColumns,
    globalPointSize,
    channelSize,
    channelBrightness,
    channelColor,
    globalPointBrightness,
    stories,
    colorScales: colorScalesState,
  };
}

export const rootReducer = (state, action) => {
  if (action.type === RootActionTypes.RESET) {
    const { dataset, openTab, viewTransform, datasetEntries } = state;
    state = { dataset, openTab, viewTransform, datasetEntries };
  }

  return appReducer(state, action);
};

export function createRootReducer(reducers: any) {
  const root = { ...allReducers };
  Object.assign(root, reducers);

  const combined = combineReducers(root);

  return (state, action) => {
    if (action.type === RootActionTypes.RESET) {
      const { dataset, openTab, viewTransform, datasetEntries } = state;
      state = { dataset, openTab, viewTransform, datasetEntries };
    }

    if (action.type === RootActionTypes.HYDRATE) {
      const newState = { ...state };

      Object.assign(newState, action.dump);

      return newState;
    }

    if (action.type === RootActionTypes.DATASET) {
      const newState = { ...state };

      const partialRootState = createInitialReducerState(action.dataset);
      partialRootState.dataset = action.dataset;
      Object.assign(newState, partialRootState);

      return newState;
    }

    return combined(state, action);
  };
}

export type RootState = ReturnType<typeof rootReducer>;
