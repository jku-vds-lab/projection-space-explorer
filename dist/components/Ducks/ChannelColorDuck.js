"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/channelColor/SET";
const channelColor = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.channelColor;
        default:
            return state;
    }
};
exports.setChannelColor = channelColor => ({
    type: SET,
    channelColor: channelColor
});
exports.default = channelColor;
