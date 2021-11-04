"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/checkedShapes/SET";
exports.setCheckedShapesAction = checkedShapes => ({
    type: SET,
    checkedShapes: checkedShapes
});
exports.checkedShapes = (state = { 'star': true, 'cross': true, 'circle': true, 'square': true }, action) => {
    switch (action.type) {
        case SET:
            return action.checkedShapes;
        default:
            return state;
    }
};
exports.default = exports.checkedShapes;
