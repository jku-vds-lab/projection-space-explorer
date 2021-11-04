"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/hoverState/SET";
exports.setHoverState = (hoverState, updater) => ({
    type: SET,
    input: { data: hoverState, updater: updater }
});
const initialState = {
    data: null,
    updater: ""
};
const hoverState = (state = initialState, action) => {
    var _a, _b;
    switch (action.type) {
        case SET:
            return Object.assign(Object.assign({}, state), { data: (_a = action.input) === null || _a === void 0 ? void 0 : _a.data, updater: (_b = action.input) === null || _b === void 0 ? void 0 : _b.updater });
        default:
            return state;
    }
};
exports.default = hoverState;
