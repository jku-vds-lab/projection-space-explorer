"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/selectedVectorByShape/SET";
exports.setSelectedVectorByShapeAction = selectedVectorByShape => ({
    type: SET,
    selectedVectorByShape: selectedVectorByShape
});
const selectedVectorByShape = (state = "", action) => {
    switch (action.type) {
        case SET:
            return action.selectedVectorByShape;
        default:
            return state;
    }
};
exports.default = selectedVectorByShape;
