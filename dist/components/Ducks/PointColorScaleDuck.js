"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/pointColorScale/SET";
exports.setPointColorScale = pointColorScale => ({
    type: SET,
    pointColorScale: pointColorScale
});
const pointColorScale = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.pointColorScale;
        default:
            return state;
    }
};
exports.default = pointColorScale;
