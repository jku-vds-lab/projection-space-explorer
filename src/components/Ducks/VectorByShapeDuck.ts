const SET = "ducks/vectorByShape/SET"

export const setVectorByShapeAction = vectorByShape => ({
    type: SET,
    vectorByShape: vectorByShape
});

const vectorByShape = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.vectorByShape
        default:
            return state
    }
}

export default vectorByShape