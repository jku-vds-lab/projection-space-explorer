"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/vectorByShape/SET";
exports.setVectorByShapeAction = vectorByShape => ({
    type: SET,
    vectorByShape: vectorByShape
});
const vectorByShape = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.vectorByShape;
        default:
            return state;
    }
};
exports.default = vectorByShape;
