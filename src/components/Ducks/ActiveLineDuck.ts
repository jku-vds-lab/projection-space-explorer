const SET = "ducks/activeLine/SET"

const activeLine = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.activeLine
        default:
            return state
    }
}

export const setActiveLine = activeLine => ({
    type: SET,
    activeLine: activeLine
})

export default activeLine