"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/genericFingerprintAttributes/SET";
exports.setGenericFingerprintAttributes = genericFingerprintAttributes => ({
    type: SET,
    genericFingerprintAttributes: genericFingerprintAttributes
});
const genericFingerprintAttributes = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.genericFingerprintAttributes;
        default:
            return state;
    }
};
exports.default = genericFingerprintAttributes;
