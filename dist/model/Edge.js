"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("./ObjectType");
/**
 * Edge type guard.
 */
function isEdge(value) {
    return value && value.objectType === ObjectType_1.ObjectTypes.Edge;
}
exports.isEdge = isEdge;
