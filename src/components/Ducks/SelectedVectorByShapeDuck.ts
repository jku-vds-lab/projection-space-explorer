const SET = "ducks/selectedVectorByShape/SET"

export const setSelectedVectorByShapeAction = selectedVectorByShape => ({
    type: SET,
    selectedVectorByShape: selectedVectorByShape
});

const selectedVectorByShape = (state = "", action) => {
    switch (action.type) {
        case SET:
            return action.selectedVectorByShape
        default:
            return state
    }
}

export default selectedVectorByShape