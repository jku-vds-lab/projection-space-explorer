import { combineReducers } from 'redux';
import projectionOpen from "../Ducks/ProjectionOpenDuck";
import highlightedSequence from "../Ducks/HighlightedSequenceDuck";
import dataset from "../Ducks/DatasetDuck";
import openTab from "../Ducks/OpenTabDuck";
import clusterMode, { ClusterMode } from "../Ducks/ClusterModeDuck";
import advancedColoringSelection from "../Ducks/AdvancedColoringSelectionDuck";
import projectionColumns from "../Ducks/ProjectionColumnsDuck";
import displayMode from "../Ducks/DisplayModeDuck";
import lineBrightness from "../Ducks/LineBrightnessDuck";
import activeLine from "../Ducks/ActiveLineDuck";
import stories, { IStorytelling, AStorytelling } from "../Ducks/StoriesDuck";
import currentAggregation from "../Ducks/AggregationDuck";
import { viewTransform } from "../Ducks/ViewTransformDuck";
import projectionParams from "../Ducks/ProjectionParamsDuck";
import projectionWorker from "../Ducks/ProjectionWorkerDuck";
import vectorByShape from "../Ducks/VectorByShapeDuck";
import selectedVectorByShape from "../Ducks/SelectedVectorByShapeDuck";
import pathLengthRange from '../Ducks/PathLengthRange';
import channelSize from '../Ducks/ChannelSize';
import channelColor from '../Ducks/ChannelColorDuck';
import globalPointSize from '../Ducks/GlobalPointSizeDuck';
import pointColorScale from '../Ducks/PointColorScaleDuck'
import pointColorMapping from '../Ducks/PointColorMappingDuck';
import trailSettings from '../Ducks/TrailSettingsDuck';
import differenceThreshold from '../Ducks/DifferenceThresholdDuck';
import hoverSettings from '../Ducks/HoverSettingsDuck';
import hoverState from '../Ducks/HoverStateDuck';
import selectedLineBy from '../Ducks/SelectedLineByDuck';
import globalPointBrightness from '../Ducks/GlobalPointBrightnessDuck';
import channelBrightness from '../Ducks/ChannelBrightnessDuck';
import groupVisualizationMode, { GroupVisualizationMode } from '../Ducks/GroupVisualizationMode';
import genericFingerprintAttributes from '../Ducks/GenericFingerprintAttributesDuck';
import hoverStateOrientation from '../Ducks/HoverStateOrientationDuck';
import detailView from '../Ducks/DetailViewDuck';
import datasetEntries from '../Ducks/DatasetEntriesDuck';
import embeddings from '../Ducks/ProjectionDuck';
import { RootActionTypes } from './RootActions';
import { Dataset, ADataset, SegmentFN, AProjection, IProjection, IBaseProjection } from '../../model';
import { CategoryOptions, CategoryOptionsAPI } from '../WebGLView/CategoryOptions';
import { ANormalized, NormalizedDictionary } from '../Utility/NormalizedState';
import { storyLayout, graphLayout, transformIndicesToHandles } from '../Utility/graphs';
import colorScales, { BaseColorScale } from '../Ducks/ColorScalesDuck';
import clone = require('fast-clone');
import { PointDisplayReducer } from '../Ducks/PointDisplayDuck';

const allReducers = {
  currentAggregation: currentAggregation,
  stories: stories,
  openTab: openTab,
  selectedVectorByShape: selectedVectorByShape,
  vectorByShape: vectorByShape,
  pointDisplay: PointDisplayReducer,
  activeLine: activeLine,
  dataset: dataset,
  highlightedSequence: highlightedSequence,
  viewTransform: viewTransform,
  advancedColoringSelection: advancedColoringSelection,
  projectionColumns: projectionColumns,
  projectionOpen: projectionOpen,
  projectionParams: projectionParams,
  projectionWorker: projectionWorker,
  clusterMode: clusterMode,
  displayMode: displayMode,
  lineBrightness: lineBrightness,
  pathLengthRange: pathLengthRange,
  channelSize: channelSize,
  channelColor: channelColor,
  channelBrightness: channelBrightness,
  globalPointSize: globalPointSize,
  hoverState: hoverState,
  pointColorScale: pointColorScale,
  pointColorMapping: pointColorMapping,
  trailSettings: trailSettings,
  differenceThreshold: differenceThreshold,
  projections: embeddings,
  hoverSettings: hoverSettings,
  selectedLineBy: selectedLineBy,
  globalPointBrightness: globalPointBrightness,
  groupVisualizationMode: groupVisualizationMode,
  genericFingerprintAttributes: genericFingerprintAttributes,
  hoverStateOrientation: hoverStateOrientation,
  detailView: detailView,
  datasetEntries: datasetEntries,
  colorScales: colorScales
}

const appReducer = combineReducers(allReducers)







export function createInitialReducerState(dataset: Dataset): Partial<RootState> {
  const clusterMode = dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate
  const groupVisualizationMode = dataset.multivariateLabels ? GroupVisualizationMode.StarVisualization : GroupVisualizationMode.ConvexHull


  //this.finite(dataset)

  const categoryOptions = dataset.categories

  const pathLengthRange = {
    range: [0, SegmentFN.getMaxPathLength(dataset)],
    maximum: SegmentFN.getMaxPathLength(dataset)
  }

  const projections: NormalizedDictionary<IProjection> & { workspace: IBaseProjection } = {
    byId: {},
    allIds: [],
    workspace: undefined
  }

  const handle = ANormalized.add(projections, AProjection.createProjection(dataset.vectors, "Initial Projection"))
  projections.workspace = ANormalized.get(projections, handle).positions

  const genericFingerprintAttributes = ADataset.getColumns(dataset, true).map(column => ({
    feature: column,
    show: dataset.columns[column].project
  }))

  const formatRange = range => {
    try {
      return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
    } catch {
      return 'unknown'
    }
  }

  const projectionColumns = ADataset.getColumns(dataset, true).map(column => ({
    name: column,
    checked: dataset.columns[column].project,
    normalized: true,
    range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
    featureLabel: dataset.columns[column].featureLabel
  }))

  var defaultSizeAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, 'size', 'multiplicity', 'sequential')


  var globalPointSize, channelSize

  if (defaultSizeAttribute) {
    globalPointSize = [1, 2]
    channelSize = defaultSizeAttribute
  } else {
    globalPointSize = [1]
    channelSize = null
  }

  var channelColor

  var defaultColorAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, "color", "algo", "categorical")
  if (defaultColorAttribute) {
    channelColor = defaultColorAttribute
  } else {
    channelColor = null
  }

  var defaultBrightnessAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, "transparency", "age", "sequential")
  var channelBrightness, globalPointBrightness

  if (defaultBrightnessAttribute) {
    globalPointBrightness = [0.25, 1]
    channelBrightness = defaultBrightnessAttribute
  } else {
    globalPointBrightness = [1]
    channelBrightness = null
  }


  var stories: IStorytelling
  if (dataset.clusters && dataset.clusters.length > 0) {
    let clusters = dataset.clusters

    if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
      stories = {
        stories: [transformIndicesToHandles(dataset.clusters, dataset.clusterEdges)],
        active: null,
        trace: null,
        activeTraceState: null
      }
    } else {
      if (dataset.isSequential) {
        const [edges] = graphLayout(dataset, clusters)

        if (edges.length > 0) {
          let storyArr = storyLayout(clusters, edges)

          stories = {
            stories: storyArr,
            active: null,
            trace: null,
            activeTraceState: null
          }
        }
      }
    }
  } else {
    stories = AStorytelling.createEmpty()
  }

  var colorScalesState = clone(colorScales())
  if (channelColor) {
    const handle = ANormalized.entries<BaseColorScale>(colorScalesState.scales).find(([key, value]) => {
      return value.type === channelColor.type
    })[0]

    colorScalesState.active = handle
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
    colorScales: colorScalesState
  }
}





export const rootReducer = (state, action) => {
  if (action.type === RootActionTypes.RESET) {
    const { dataset, openTab, viewTransform, datasetEntries } = state;
    state = { dataset, openTab, viewTransform, datasetEntries };
  }

  return appReducer(state, action)
}





export function createRootReducer(reducers: any) {
  const root = Object.assign({}, allReducers)
  Object.assign(root, reducers)

  const combined = combineReducers(root)

  return (state, action) => {
    if (action.type === RootActionTypes.RESET) {
      const { dataset, openTab, viewTransform, datasetEntries } = state;
      state = { dataset, openTab, viewTransform, datasetEntries };
    }

    if (action.type === RootActionTypes.HYDRATE) {
      const newState = { ...state }

      Object.assign(newState, action.dump)

      return newState
    }

    if (action.type === RootActionTypes.DATASET) {
      const newState = { ...state }

      const partialRootState = createInitialReducerState(action.dataset)
      partialRootState.dataset = action.dataset
      Object.assign(newState, partialRootState)

      return newState
    }

    return combined(state, action)
  }
}


export type RootState = ReturnType<typeof rootReducer>
