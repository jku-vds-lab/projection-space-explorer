import { CategoryOptions } from "../WebGLView/CategoryOptions"

const SET = "ducks/categoryOptions/SET"

const initialState: CategoryOptions = null

const categoryOptions = (state = initialState, action): CategoryOptions => {
    switch (action.type) {
        case SET:
            return action.categoryOptions
        default:
            return state
    }
}

export default categoryOptions

export const setCategoryOptions = (categoryOptions: CategoryOptions) => ({
    type: SET,
    categoryOptions: categoryOptions
});
