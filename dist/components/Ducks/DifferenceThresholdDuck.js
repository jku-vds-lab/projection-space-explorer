"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "differenceThreshold/SET";
exports.differenceThreshold = (state = 0.25, action) => {
    switch (action.type) {
        case SET:
            return action.differenceThreshold;
        default:
            return state;
    }
};
exports.setDifferenceThreshold = (differenceThreshold) => ({
    type: SET,
    differenceThreshold: differenceThreshold
});
exports.default = exports.differenceThreshold;
