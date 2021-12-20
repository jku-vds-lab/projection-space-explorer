"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const ProjectionOpenDuck_1 = require("../Ducks/ProjectionOpenDuck");
const HighlightedSequenceDuck_1 = require("../Ducks/HighlightedSequenceDuck");
const DatasetDuck_1 = require("../Ducks/DatasetDuck");
const OpenTabDuck_1 = require("../Ducks/OpenTabDuck");
const ClusterModeDuck_1 = require("../Ducks/ClusterModeDuck");
const AdvancedColoringSelectionDuck_1 = require("../Ducks/AdvancedColoringSelectionDuck");
const ProjectionColumnsDuck_1 = require("../Ducks/ProjectionColumnsDuck");
const DisplayModeDuck_1 = require("../Ducks/DisplayModeDuck");
const LineBrightnessDuck_1 = require("../Ducks/LineBrightnessDuck");
const ActiveLineDuck_1 = require("../Ducks/ActiveLineDuck");
const StoriesDuck_1 = require("../Ducks/StoriesDuck");
const AggregationDuck_1 = require("../Ducks/AggregationDuck");
const ViewTransformDuck_1 = require("../Ducks/ViewTransformDuck");
const ProjectionParamsDuck_1 = require("../Ducks/ProjectionParamsDuck");
const CheckedShapesDuck_1 = require("../Ducks/CheckedShapesDuck");
const ProjectionWorkerDuck_1 = require("../Ducks/ProjectionWorkerDuck");
const VectorByShapeDuck_1 = require("../Ducks/VectorByShapeDuck");
const SelectedVectorByShapeDuck_1 = require("../Ducks/SelectedVectorByShapeDuck");
const PathLengthRange_1 = require("../Ducks/PathLengthRange");
const CategoryOptionsDuck_1 = require("../Ducks/CategoryOptionsDuck");
const ChannelSize_1 = require("../Ducks/ChannelSize");
const ChannelColorDuck_1 = require("../Ducks/ChannelColorDuck");
const GlobalPointSizeDuck_1 = require("../Ducks/GlobalPointSizeDuck");
const PointColorScaleDuck_1 = require("../Ducks/PointColorScaleDuck");
const PointColorMappingDuck_1 = require("../Ducks/PointColorMappingDuck");
const TrailSettingsDuck_1 = require("../Ducks/TrailSettingsDuck");
const DifferenceThresholdDuck_1 = require("../Ducks/DifferenceThresholdDuck");
const ProjectionsDuck_1 = require("../Ducks/ProjectionsDuck");
const HoverSettingsDuck_1 = require("../Ducks/HoverSettingsDuck");
const HoverStateDuck_1 = require("../Ducks/HoverStateDuck");
const SelectedLineByDuck_1 = require("../Ducks/SelectedLineByDuck");
const GlobalPointBrightnessDuck_1 = require("../Ducks/GlobalPointBrightnessDuck");
const ChannelBrightnessDuck_1 = require("../Ducks/ChannelBrightnessDuck");
const GroupVisualizationMode_1 = require("../Ducks/GroupVisualizationMode");
const GenericFingerprintAttributesDuck_1 = require("../Ducks/GenericFingerprintAttributesDuck");
const HoverStateOrientationDuck_1 = require("../Ducks/HoverStateOrientationDuck");
const DetailViewDuck_1 = require("../Ducks/DetailViewDuck");
const allReducers = {
    currentAggregation: AggregationDuck_1.default,
    stories: StoriesDuck_1.default,
    openTab: OpenTabDuck_1.default,
    selectedVectorByShape: SelectedVectorByShapeDuck_1.default,
    vectorByShape: VectorByShapeDuck_1.default,
    checkedShapes: CheckedShapesDuck_1.default,
    activeLine: ActiveLineDuck_1.default,
    dataset: DatasetDuck_1.default,
    highlightedSequence: HighlightedSequenceDuck_1.default,
    viewTransform: ViewTransformDuck_1.viewTransform,
    advancedColoringSelection: AdvancedColoringSelectionDuck_1.default,
    projectionColumns: ProjectionColumnsDuck_1.default,
    projectionOpen: ProjectionOpenDuck_1.default,
    projectionParams: ProjectionParamsDuck_1.default,
    projectionWorker: ProjectionWorkerDuck_1.default,
    clusterMode: ClusterModeDuck_1.default,
    displayMode: DisplayModeDuck_1.default,
    lineBrightness: LineBrightnessDuck_1.default,
    pathLengthRange: PathLengthRange_1.default,
    categoryOptions: CategoryOptionsDuck_1.default,
    channelSize: ChannelSize_1.default,
    channelColor: ChannelColorDuck_1.default,
    channelBrightness: ChannelBrightnessDuck_1.default,
    globalPointSize: GlobalPointSizeDuck_1.default,
    hoverState: HoverStateDuck_1.default,
    pointColorScale: PointColorScaleDuck_1.default,
    pointColorMapping: PointColorMappingDuck_1.default,
    trailSettings: TrailSettingsDuck_1.default,
    differenceThreshold: DifferenceThresholdDuck_1.default,
    projections: ProjectionsDuck_1.default,
    hoverSettings: HoverSettingsDuck_1.default,
    selectedLineBy: SelectedLineByDuck_1.default,
    globalPointBrightness: GlobalPointBrightnessDuck_1.default,
    groupVisualizationMode: GroupVisualizationMode_1.default,
    genericFingerprintAttributes: GenericFingerprintAttributesDuck_1.default,
    hoverStateOrientation: HoverStateOrientationDuck_1.default,
    detailView: DetailViewDuck_1.default
};
const appReducer = redux_1.combineReducers(allReducers);
exports.rootReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
        const { dataset, openTab, viewTransform } = state;
        state = { dataset, openTab, viewTransform };
    }
    return appReducer(state, action);
};
function createRootReducer(reducers) {
    const root = Object.assign({}, allReducers);
    Object.assign(root, reducers);
    const combined = redux_1.combineReducers(root);
    return (state, action) => {
        if (action.type === 'RESET_APP') {
            const { dataset, openTab, viewTransform } = state;
            state = { dataset, openTab, viewTransform };
        }
        return combined(state, action);
    };
}
exports.createRootReducer = createRootReducer;
