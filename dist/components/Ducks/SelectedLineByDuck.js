"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/selectedLineBy/SET";
const OPT = "ducks/selectedLineBy/OPT";
exports.setSelectedLineBy = lineBy => ({
    type: SET,
    value: lineBy
});
exports.setLineByOptions = options => ({
    type: OPT,
    options: options
});
const initialState = {
    value: "",
    options: []
};
function selectedLineBy(state = initialState, action) {
    switch (action.type) {
        case SET:
            return {
                options: state.options,
                value: action.value
            };
        case OPT:
            return {
                options: action.options,
                value: ""
            };
        default:
            return state;
    }
}
exports.selectedLineBy = selectedLineBy;
;
exports.default = selectedLineBy;
