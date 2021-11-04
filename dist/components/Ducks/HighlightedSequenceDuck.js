"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/highlightedSequence/SET";
exports.setHighlightedSequenceAction = highlightedSequence => ({
    type: SET,
    highlightedSequence: highlightedSequence
});
const highlightedSequence = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.highlightedSequence;
        default:
            return state;
    }
};
exports.default = highlightedSequence;
