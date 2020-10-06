const SET = "ducks/viewTransform/SET"

export const setViewTransform = viewTransform => ({
    type: SET,
    viewTransform: viewTransform
});

export const viewTransform = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.viewTransform
        default:
            return state
    }
}