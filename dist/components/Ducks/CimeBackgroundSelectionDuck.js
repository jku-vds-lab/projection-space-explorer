"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/cimeBackgroundSelection/SET";
function setCimeBackgroundSelection(cimeBackgroundSelection) {
    return {
        type: SET,
        cimeBackgroundSelection: cimeBackgroundSelection
    };
}
exports.setCimeBackgroundSelection = setCimeBackgroundSelection;
const initialState = null;
function cimeBackgroundSelection(state = initialState, action) {
    switch (action.type) {
        case SET:
            return action.cimeBackgroundSelection;
        default:
            return state;
    }
}
exports.default = cimeBackgroundSelection;
