"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/selectedVectorByColor/SET";
const selectedVectorByColor = (state = "", action) => {
    switch (action.type) {
        case SET:
            return action.selectedVectorByColor;
        default:
            return state;
    }
};
exports.default = selectedVectorByColor;
