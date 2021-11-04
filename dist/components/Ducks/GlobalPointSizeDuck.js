"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/globalPointSize/SET";
exports.setGlobalPointSize = globalPointSize => ({
    type: SET,
    globalPointSize: globalPointSize
});
const globalPointSize = (state = [1], action) => {
    switch (action.type) {
        case SET:
            return action.globalPointSize;
        default:
            return state;
    }
};
exports.default = globalPointSize;
