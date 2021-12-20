"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET_VISIBILITY = 'setvisibility';
function setDetailVisibility(open) {
    return {
        type: SET_VISIBILITY,
        open: open
    };
}
exports.setDetailVisibility = setDetailVisibility;
const initialState = {
    open: false,
    active: ''
};
function detailView(state = initialState, action) {
    switch (action.type) {
        case SET_VISIBILITY:
            return Object.assign(Object.assign({}, state), { open: action.open });
        default:
            return state;
    }
}
exports.default = detailView;
