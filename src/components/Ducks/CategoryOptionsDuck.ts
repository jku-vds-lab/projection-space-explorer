const SET = "ducks/categoryOptions/SET"

const categoryOptions = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.categoryOptions
        default:
            return state
    }
}

export default categoryOptions

export const setCategoryOptions = categoryOptions => ({
    type: SET,
    categoryOptions: categoryOptions
});
