"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "lineBrightness/SET";
const lineBrightness = (state = 30, action) => {
    switch (action.type) {
        case SET:
            return action.lineBrightness;
        default:
            return state;
    }
};
exports.setLineBrightness = (lineBrightness) => ({
    type: SET,
    lineBrightness: lineBrightness
});
exports.default = lineBrightness;
