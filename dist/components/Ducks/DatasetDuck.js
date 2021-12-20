"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/database/SET";
const SET_VECT = "ducks/database/SET_VECT";
function setDatasetAction(dataset) {
    return {
        type: SET,
        dataset: dataset
    };
}
exports.setDatasetAction = setDatasetAction;
exports.setDatasetVectAction = input => ({
    type: SET_VECT,
    input: input
});
const initialState = null;
function dataset(state = initialState, action) {
    switch (action.type) {
        case SET:
            return action.dataset;
        default:
            return state;
    }
}
exports.default = dataset;
