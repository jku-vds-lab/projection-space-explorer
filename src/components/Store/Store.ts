import { combineReducers } from 'redux';
import projectionOpen from "../Ducks/ProjectionOpenDuck";
import highlightedSequence from "../Ducks/HighlightedSequenceDuck";
import dataset from "../Ducks/DatasetDuck";
import openTab from "../Ducks/OpenTabDuck";
import clusterMode from "../Ducks/ClusterModeDuck";
import advancedColoringSelection from "../Ducks/AdvancedColoringSelectionDuck";
import projectionColumns from "../Ducks/ProjectionColumnsDuck";
import displayMode from "../Ducks/DisplayModeDuck";
import lineBrightness from "../Ducks/LineBrightnessDuck";
import activeLine from "../Ducks/ActiveLineDuck";
import stories from "../Ducks/StoriesDuck";
import currentAggregation from "../Ducks/AggregationDuck";
import { viewTransform } from "../Ducks/ViewTransformDuck";
import projectionParams from "../Ducks/ProjectionParamsDuck";
import checkedShapes from "../Ducks/CheckedShapesDuck";
import projectionWorker from "../Ducks/ProjectionWorkerDuck";
import vectorByShape from "../Ducks/VectorByShapeDuck";
import selectedVectorByShape from "../Ducks/SelectedVectorByShapeDuck";
import pathLengthRange from '../Ducks/PathLengthRange';
import categoryOptions from '../Ducks/CategoryOptionsDuck';
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
import groupVisualizationMode from '../Ducks/GroupVisualizationMode';
import genericFingerprintAttributes from '../Ducks/GenericFingerprintAttributesDuck';
import hoverStateOrientation from '../Ducks/HoverStateOrientationDuck';
import detailView from '../Ducks/DetailViewDuck';
import datasetEntries from '../Ducks/DatasetEntriesDuck';
import embeddings from '../Ducks/ProjectionDuck';
import { RootActionTypes } from './RootActions';

const allReducers = {
  currentAggregation: currentAggregation,
  stories: stories,
  openTab: openTab,
  selectedVectorByShape: selectedVectorByShape,
  vectorByShape: vectorByShape,
  checkedShapes: checkedShapes,
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
  categoryOptions: categoryOptions,
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
  datasetEntries: datasetEntries
}

const appReducer = combineReducers(allReducers)

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

    return combined(state, action)
  }
}


export type RootState = ReturnType<typeof rootReducer>
