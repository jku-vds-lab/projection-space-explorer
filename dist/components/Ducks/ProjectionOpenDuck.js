"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/projectionOpen/SET";
exports.setProjectionOpenAction = projectionOpen => ({
    type: SET,
    projectionOpen: projectionOpen
});
const projectionOpen = (state = false, action) => {
    switch (action.type) {
        case SET:
            return action.projectionOpen;
        default:
            return state;
    }
};
exports.default = projectionOpen;
