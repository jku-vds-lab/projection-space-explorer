"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "reducers/DISPLAY_MODE";
var DisplayMode;
(function (DisplayMode) {
    DisplayMode[DisplayMode["None"] = 0] = "None";
    DisplayMode[DisplayMode["OnlyStates"] = 1] = "OnlyStates";
    DisplayMode[DisplayMode["OnlyClusters"] = 2] = "OnlyClusters";
    DisplayMode[DisplayMode["StatesAndClusters"] = 3] = "StatesAndClusters";
})(DisplayMode = exports.DisplayMode || (exports.DisplayMode = {}));
function displayModeSupportsStates(displayMode) {
    return displayMode == DisplayMode.OnlyStates || displayMode == DisplayMode.StatesAndClusters;
}
exports.displayModeSupportsStates = displayModeSupportsStates;
function displayModeSuportsClusters(displayMode) {
    return displayMode == DisplayMode.OnlyClusters || displayMode == DisplayMode.StatesAndClusters;
}
exports.displayModeSuportsClusters = displayModeSuportsClusters;
function displayMode(state = DisplayMode.StatesAndClusters, action) {
    switch (action.type) {
        case SET:
            return action.displayMode;
        default:
            return state;
    }
}
exports.default = displayMode;
exports.setDisplayMode = (displayMode) => {
    return {
        type: SET,
        displayMode: displayMode
    };
};
