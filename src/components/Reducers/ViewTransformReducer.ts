export const viewTransform = (state = null, action) => {
    switch (action.type) {
        case 'SET_VIEW_TRANSFORM':
            return action.viewTransform
        default:
            return state
    }
}