"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/pathLengthRange/SET";
const SET_MAX = "ducks/pathLengthRange/SET_MAX";
exports.setPathLengthRange = pathLengthRange => ({
    type: SET,
    range: pathLengthRange
});
exports.setPathLengthMaximum = pathLengthMaximum => ({
    type: SET_MAX,
    maximum: pathLengthMaximum
});
const pathLengthRange = (state = { range: [0, 100], maximum: 100 }, action) => {
    switch (action.type) {
        case SET:
            return {
                range: action.range,
                maximum: state.maximum
            };
        case SET_MAX:
            return {
                range: state.range,
                maximum: action.maximum
            };
        default:
            return state;
    }
};
exports.default = pathLengthRange;
