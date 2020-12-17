const SET = "ducks/checkedShapes/SET"

export const setCheckedShapesAction = checkedShapes => ({
    type: SET,
    checkedShapes: checkedShapes
});

export const checkedShapes = (state = { 'star': true, 'cross': true, 'circle': true, 'square': true }, action) => {
    switch (action.type) {
        case SET:
            return action.checkedShapes
        default:
            return state
    }
}
export default checkedShapes