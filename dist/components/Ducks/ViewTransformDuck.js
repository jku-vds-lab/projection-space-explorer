"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/viewTransform/SET";
const INVALIDATE = "ducks/viewTransform/INVALIDATE";
exports.setViewTransform = (camera, width, height) => ({
    type: SET,
    camera: camera,
    width: width,
    height: height
});
exports.invalidateTransform = () => ({
    type: INVALIDATE
});
const initialState = {
    camera: null,
    width: 0,
    height: 0
};
exports.viewTransform = (state = initialState, action) => {
    switch (action.type) {
        case SET:
            return {
                camera: action.camera,
                width: action.width,
                height: action.height
            };
        case INVALIDATE:
            return {
                camera: state.camera,
                width: state.width,
                height: state.height
            };
        default:
            return state;
    }
};
