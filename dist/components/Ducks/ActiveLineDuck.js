"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/activeLine/SET";
const activeLine = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.activeLine;
        default:
            return state;
    }
};
exports.setActiveLine = activeLine => ({
    type: SET,
    activeLine: activeLine
});
exports.default = activeLine;
