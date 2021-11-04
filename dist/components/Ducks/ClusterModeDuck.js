"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/clusterMode/SET";
var ClusterMode;
(function (ClusterMode) {
    ClusterMode[ClusterMode["Univariate"] = 0] = "Univariate";
    ClusterMode[ClusterMode["Multivariate"] = 1] = "Multivariate";
})(ClusterMode = exports.ClusterMode || (exports.ClusterMode = {}));
exports.setClusterModeAction = clusterMode => ({
    type: SET,
    clusterMode: clusterMode
});
function clusterMode(state = ClusterMode.Univariate, action) {
    switch (action.type) {
        case SET:
            return action.clusterMode;
        default:
            return state;
    }
}
exports.default = clusterMode;
