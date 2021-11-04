"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/globalPointBrightness/SET";
exports.setGlobalPointBrightness = globalPointBrightness => ({
    type: SET,
    globalPointBrightness: globalPointBrightness
});
const globalPointBrightness = (state = [1], action) => {
    switch (action.type) {
        case SET:
            return action.globalPointBrightness;
        default:
            return state;
    }
};
exports.default = globalPointBrightness;
