"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/hoverSettings/SET_HOVER_WINDOW_MODE";
exports.setHoverWindowMode = windowMode => ({
    type: SET,
    windowMode: windowMode
});
var WindowMode;
(function (WindowMode) {
    WindowMode[WindowMode["Embedded"] = 0] = "Embedded";
    WindowMode[WindowMode["Extern"] = 1] = "Extern";
})(WindowMode = exports.WindowMode || (exports.WindowMode = {}));
const initialState = {
    windowMode: WindowMode.Embedded
};
const hoverSettings = (state = initialState, action) => {
    switch (action.type) {
        case SET:
            return {
                windowMode: action.windowMode
            };
        default:
            return state;
    }
};
exports.default = hoverSettings;
