"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/pointColorMapping/SET";
exports.setPointColorMapping = pointColorMapping => ({
    type: SET,
    pointColorMapping: pointColorMapping
});
const pointColorMapping = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.pointColorMapping;
        default:
            return state;
    }
};
exports.default = pointColorMapping;
