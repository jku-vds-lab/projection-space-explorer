"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/projectionWorker/SET";
exports.setProjectionWorkerAction = projectionWorker => ({
    type: SET,
    projectionWorker: projectionWorker
});
const initialState = null;
function projectionWorker(state = initialState, action) {
    switch (action.type) {
        case SET:
            return action.projectionWorker;
        default:
            return state;
    }
}
exports.default = projectionWorker;
