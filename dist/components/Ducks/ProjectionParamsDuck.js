"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/projectionParams/SET";
exports.setProjectionParamsAction = projectionParams => ({
    type: SET,
    projectionParams: projectionParams
});
const initialState = {
    perplexity: 50,
    learningRate: 50,
    nNeighbors: 15,
    iterations: 1000,
    seeded: false,
    useSelection: false,
    method: '',
    distanceMetric: 'euclidean'
};
const projectionParams = (state = initialState, action) => {
    switch (action.type) {
        case SET:
            return action.projectionParams;
        default:
            return state;
    }
};
exports.default = projectionParams;
