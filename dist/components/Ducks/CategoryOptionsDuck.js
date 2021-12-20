"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET = "ducks/categoryOptions/SET";
const initialState = null;
const categoryOptions = (state = initialState, action) => {
    switch (action.type) {
        case SET:
            return action.categoryOptions;
        default:
            return state;
    }
};
exports.default = categoryOptions;
exports.setCategoryOptions = (categoryOptions) => ({
    type: SET,
    categoryOptions: categoryOptions
});
