"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/groupVisualizationMode/SET";
exports.setGroupVisualizationMode = groupVisualizationMode => ({
    type: SET,
    groupVisualizationMode: groupVisualizationMode
});
var GroupVisualizationMode;
(function (GroupVisualizationMode) {
    GroupVisualizationMode[GroupVisualizationMode["None"] = 0] = "None";
    GroupVisualizationMode[GroupVisualizationMode["StarVisualization"] = 1] = "StarVisualization";
    GroupVisualizationMode[GroupVisualizationMode["ConvexHull"] = 2] = "ConvexHull";
})(GroupVisualizationMode = exports.GroupVisualizationMode || (exports.GroupVisualizationMode = {}));
const groupVisualizationMode = (state = GroupVisualizationMode.None, action) => {
    switch (action.type) {
        case SET:
            return action.groupVisualizationMode;
        default:
            return state;
    }
};
exports.default = groupVisualizationMode;
