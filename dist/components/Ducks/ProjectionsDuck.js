"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADD = "ducks/projections/ADD";
const DELETE = "ducks/projections/DELETE";
exports.addProjectionAction = (projection) => ({
    type: ADD,
    projection: projection
});
exports.deleteProjectionAction = (projection) => ({
    type: DELETE,
    projection: projection
});
const initialState = [];
function projections(state = initialState, action) {
    switch (action.type) {
        case ADD: {
            let copy = state.slice(0);
            copy.push(action.projection);
            return copy;
        }
        case DELETE: {
            let copy = state.slice(0);
            copy.splice(copy.indexOf(action.projection), 1);
            return copy;
        }
        default:
            return state;
    }
}
exports.default = projections;
