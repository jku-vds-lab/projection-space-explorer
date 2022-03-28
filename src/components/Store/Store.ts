import { v4 as uuidv4 } from 'uuid';
import { createEntityAdapter, EntityState, EntityId } from '@reduxjs/toolkit';
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
import activeLine from '../Ducks/ActiveLineDuck';
import currentAggregation from '../Ducks/AggregationDuck';
import projectionParams from '../Ducks/ProjectionParamsDuck';
import projectionWorker from '../Ducks/ProjectionWorkerDuck';
import trailSettings from '../Ducks/TrailSettingsDuck';
import { differenceThreshold } from '../Ducks/DifferenceThresholdDuck';
import hoverSettings from '../Ducks/HoverSettingsDuck';
import hoverState from '../Ducks/HoverStateDuck';
import { selectedLineBy } from '../Ducks/SelectedLineByDuck';
import groupVisualizationMode, { GroupVisualizationMode } from '../Ducks/GroupVisualizationMode';
import genericFingerprintAttributes from '../Ducks/GenericFingerprintAttributesDuck';
import hoverStateOrientation from '../Ducks/HoverStateOrientationDuck';
import detailView from '../Ducks/DetailViewDuck';
import datasetEntries from '../Ducks/DatasetEntriesDuck';
import { RootActionTypes } from './RootActions';
import { Dataset, ADataset, SegmentFN, AProjection, IBook, ProjectionMethod, IProjection } from '../../model';
import { CategoryOptionsAPI } from '../WebGLView/CategoryOptions';
import { ANormalized } from '../Utility/NormalizedState';
import { storyLayout, graphLayout, transformIndicesToHandles } from '../Utility/graphs';
import colorScales from '../Ducks/ColorScalesDuck';
import { BaseColorScale } from '../../model/Palette';
import { PointDisplayReducer } from '../Ducks/PointDisplayDuck';
import { multiplesSlice, multipleAdapter, defaultAttributes } from '../Ducks/ViewDuck';
import { stories, IStorytelling, AStorytelling } from '../Ducks/StoriesDuck copy';

/**
 * Match all cases of view constants eg x1, y1, x2, y2...
 */
const viewRegexp = /^(x|y)[0-9]$/;

const allReducers = {
  currentAggregation,
  stories,
  openTab,
  pointDisplay: PointDisplayReducer,
  activeLine,
  dataset,
  highlightedSequence,
  advancedColoringSelection,
  projectionColumns,
  projectionOpen,
  projectionParams,
  projectionWorker,
  clusterMode,
  displayMode,
  hoverState,
  trailSettings,
  differenceThreshold,
  hoverSettings,
  selectedLineBy,
  groupVisualizationMode,
  genericFingerprintAttributes,
  hoverStateOrientation,
  detailView,
  datasetEntries,
  colorScales,
  multiples: multiplesSlice.reducer,
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

  let projections: EntityState<IProjection> = null;
  let workspace: IProjection | EntityId = null;

  if (dataset.hasInitialScalarTypes) {
    // When the dataset has initial positions, add this as a projection
    const initialProjection = AProjection.createProjection(
      dataset.vectors.map((vector) => ({ x: vector.x, y: vector.y })),
      'Initial Projection',
      { method: ProjectionMethod.DATASET },
    );

    projections = {
      entities: { [initialProjection.hash]: initialProjection },
      ids: [initialProjection.hash],
    };

    workspace = initialProjection.hash;
  } else {
    // If no initial positions -> add temporary projection
    // When the dataset has initial positions, add this as a projection
    const initialProjection = AProjection.createProjection(
      dataset.vectors.map((vector) => ({ x: vector.x, y: vector.y })),
      'Random Initialisation',
      { method: ProjectionMethod.RANDOM },
    );

    projections = {
      entities: {},
      ids: [],
    };

    workspace = initialProjection;
  }

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
  if (defaultColorAttribute && !dataset.inferredColumns.includes('algo')) {
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
      const [edges] = graphLayout(dataset, clusters);
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
  let pointColorScale = null;
  if (channelColor) {
    pointColorScale = ANormalized.entries<BaseColorScale>(colorScalesState.scales).find(([, value]) => {
      return value.type === channelColor.type;
    })[0];
  }

  // Load views from dataset
  const xyChannels = {};

  const maxView = Object.entries(dataset.columns).reduce((prev, [key, curr]) => {
    try {
      const { view } = curr.metaInformation;
      if (Array.isArray(view)) {
        let max = prev;
        view.forEach((channel) => {
          if (typeof channel === 'string' && viewRegexp.test(channel)) {
            const vI = Number.parseInt(channel.charAt(1), 10);
            xyChannels[channel] = key;

            if (vI > max) {
              max = vI;
            }
          }
        });

        return max;
      }

      return prev;
    } catch (e) {
      return 0;
    }
  }, 0);

  let multiplesCollection = multipleAdapter.getInitialState();

  if (maxView > 0) {
    for (let i = 0; i < maxView; i++) {
      const vId = uuidv4();

      const xChannel = xyChannels[`x${i + 1}`];
      const yChannel = xyChannels[`y${i + 1}`];

      const view = {
        id: vId,
        attributes: {
          ...defaultAttributes(),
          workspace: AProjection.createManualProjection(xChannel, yChannel),
        },
      };

      multiplesCollection = multipleAdapter.addOne(multiplesCollection, view);
    }
  } else {
    const multipleId = uuidv4();

    const defaultView = {
      id: multipleId,
      attributes: {
        ...defaultAttributes(),
        channelBrightness,
        channelSize,
        channelColor,
        globalPointBrightness,
        globalPointSize,
        pathLengthRange,
        pointColorScale,
        workspace,
      },
    };

    multiplesCollection = multipleAdapter.addOne(multiplesCollection, defaultView);
  }

  const multiples = {
    multiples: multiplesCollection,
    active: multiplesCollection.ids[0],
    projections,
  };

  return {
    clusterMode,
    groupVisualizationMode,
    genericFingerprintAttributes,
    projectionColumns,
    stories,
    colorScales: colorScalesState,
    multiples,
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
      const { dataset, openTab, datasetEntries } = state;
      state = { dataset, openTab, datasetEntries };
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

    if (action.type === RootActionTypes.HARD_RESET) {
      const clone = { ...state };
      for (const key of Object.keys(allReducers)) {
        clone[key] = undefined;
      }
      state = clone;
    }

    return combined(state, action);
  };
}

export type RootState = ReturnType<typeof rootReducer>;
