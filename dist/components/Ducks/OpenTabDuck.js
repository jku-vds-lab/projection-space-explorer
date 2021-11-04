"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/openTab/SET";
exports.setOpenTabAction = openTab => ({
    type: SET,
    openTab: openTab
});
const openTab = (state = 0, action) => {
    switch (action.type) {
        case SET:
            return action.openTab;
        default:
            return state;
    }
};
exports.default = openTab;
