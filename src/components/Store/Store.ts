import { combineReducers } from 'redux';
import currentTool from "../Ducks/CurrentToolDuck";
import projectionOpen from "../Ducks/ProjectionOpenDuck";
import highlightedSequence from "../Ducks/HighlightedSequenceDuck";
import dataset from "../Ducks/DatasetDuck";
import openTab from "../Ducks/OpenTabDuck";
import webGLView from "../Ducks/WebGLViewDuck";
import clusterMode from "../Ducks/ClusterModeDuck";
import advancedColoringSelection from "../Ducks/AdvancedColoringSelectionDuck";
import projectionColumns from "../Ducks/ProjectionColumnsDuck";
import displayMode from "../Ducks/DisplayModeDuck";
import lineBrightness from "../Ducks/LineBrightnessDuck";
import activeLine from "../Ducks/ActiveLineDuck";
import stories from "../Ducks/StoriesDuck";
import storyMode from "../Ducks/StoryModeDuck";
import currentAggregation from "../Ducks/AggregationDuck";
import { viewTransform } from "../Ducks/ViewTransformDuck";
import projectionParams from "../Ducks/ProjectionParamsDuck";
import checkedShapes from "../Ducks/CheckedShapesDuck";
import projectionWorker from "../Ducks/ProjectionWorkerDuck";
import vectorByShape from "../Ducks/VectorByShapeDuck";
import clusterEdges from "../Ducks/ClusterEdgesDuck";
import selectedVectorByShape from "../Ducks/SelectedVectorByShapeDuck";
import pathLengthRange from '../Ducks/PathLengthRange';
import categoryOptions from '../Ducks/CategoryOptionsDuck';
import channelSize from '../Ducks/ChannelSize';
import channelColor from '../Ducks/ChannelColorDuck';
import globalPointSize from '../Ducks/GlobalPointSizeDuck';
import pointColorScale from '../Ducks/PointColorScaleDuck'
import pointColorMapping from '../Ducks/PointColorMappingDuck';
import trailSettings from '../Ducks/TrailSettingsDuck';
import storyEditor from '../Ducks/StoryEditorDuck';
import lineUpInput from '../Ducks/LineUpInputDuck';
import differenceThreshold from '../Ducks/DifferenceThresholdDuck';
import projections from '../Ducks/ProjectionsDuck';
import hoverSettings from '../Ducks/HoverSettingsDuck';
import hoverState from '../Ducks/HoverStateDuck';
import selectedLineBy from '../Ducks/SelectedLineByDuck';
import splitRef from '../Ducks/SplitRefDuck';

const allReducers = {
  currentTool: currentTool,
  currentAggregation: currentAggregation,
  stories: stories,
  openTab: openTab,
  clusterEdges: clusterEdges,
  selectedVectorByShape: selectedVectorByShape,
  vectorByShape: vectorByShape,
  checkedShapes: checkedShapes,
  activeLine: activeLine,
  dataset: dataset,
  highlightedSequence: highlightedSequence,
  viewTransform: viewTransform,
  advancedColoringSelection: advancedColoringSelection,
  storyMode: storyMode,
  projectionColumns: projectionColumns,
  projectionOpen: projectionOpen,
  projectionParams: projectionParams,
  projectionWorker: projectionWorker,
  webGLView: webGLView,
  clusterMode: clusterMode,
  displayMode: displayMode,
  lineBrightness: lineBrightness,
  pathLengthRange: pathLengthRange,
  categoryOptions: categoryOptions,
  channelSize: channelSize,
  channelColor: channelColor,
  globalPointSize: globalPointSize,
  hoverState: hoverState,
  pointColorScale: pointColorScale,
  pointColorMapping: pointColorMapping,
  trailSettings: trailSettings,
  storyEditor: storyEditor,
  lineUpInput: lineUpInput,
  differenceThreshold: differenceThreshold,
  projections: projections,
  hoverSettings: hoverSettings,
  selectedLineBy: selectedLineBy,
  splitRef: splitRef
}

const appReducer = combineReducers(allReducers)

export const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    const { dataset, openTab, viewTransform, webGLView } = state;
    state = { dataset, openTab, viewTransform, webGLView };
  }

  return appReducer(state, action)
}

export type RootState = ReturnType<typeof rootReducer>
