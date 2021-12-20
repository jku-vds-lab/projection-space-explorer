"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/channelSize/SET";
const channelSize = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.channelSize;
        default:
            return state;
    }
};
exports.setChannelSize = channelSize => ({
    type: SET,
    channelSize: channelSize
});
exports.default = channelSize;
