"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "hoverStateOrientation/SET";
var HoverStateOrientation;
(function (HoverStateOrientation) {
    HoverStateOrientation[HoverStateOrientation["SouthWest"] = 0] = "SouthWest";
    HoverStateOrientation[HoverStateOrientation["NorthEast"] = 1] = "NorthEast";
})(HoverStateOrientation = exports.HoverStateOrientation || (exports.HoverStateOrientation = {}));
const hoverStateOrientation = (state = HoverStateOrientation.NorthEast, action) => {
    switch (action.type) {
        case SET:
            return action.hoverStateOrientation;
        default:
            return state;
    }
};
exports.setHoverStateOrientation = (hoverStateOrientation) => ({
    type: SET,
    hoverStateOrientation: hoverStateOrientation
});
exports.default = hoverStateOrientation;
