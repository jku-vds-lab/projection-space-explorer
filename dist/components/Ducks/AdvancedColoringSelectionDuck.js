"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/advancedColoringSelection/SET";
const advancedColoringSelection = (state = new Array(100).fill(true), action) => {
    switch (action.type) {
        case SET:
            return action.advancedColoringSelection;
        default:
            return state;
    }
};
exports.default = advancedColoringSelection;
exports.setAdvancedColoringSelectionAction = advancedColoringSelection => ({
    type: SET,
    advancedColoringSelection: advancedColoringSelection
});
