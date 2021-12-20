"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET_LENGTH = "ducks/trailSettings/SET_LENGTH";
const SET_VISIBILITY = "ducks/trailSettings/SET_VISIBILITY";
const initialState = {
    length: 50,
    show: true
};
function trailSettings(state = initialState, action) {
    switch (action.type) {
        case SET_LENGTH:
            return {
                show: state.show,
                length: action.length
            };
        case SET_VISIBILITY:
            return {
                show: action.show,
                length: state.length
            };
        default:
            return state;
    }
}
exports.default = trailSettings;
;
function setTrailLength(length) {
    return {
        type: SET_LENGTH,
        length: length
    };
}
exports.setTrailLength = setTrailLength;
function setTrailVisibility(show) {
    return {
        type: SET_VISIBILITY,
        show: show
    };
}
exports.setTrailVisibility = setTrailVisibility;
