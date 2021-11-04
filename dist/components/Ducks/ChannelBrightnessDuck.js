"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET_SELECTION = "ducks/channelBrightness/SET_SELECTION";
const channelBrightness = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTION:
            return action.selection;
        default:
            return state;
    }
};
exports.setChannelBrightnessSelection = selection => ({
    type: SET_SELECTION,
    selection: selection
});
exports.default = channelBrightness;
