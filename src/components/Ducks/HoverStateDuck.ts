const SET = "ducks/hoverState/SET"

export const setHoverState = hoverState => ({
    type: SET,
    hoverState: hoverState
});

const hoverState = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.hoverState
        default:
            return state
    }
}

export default hoverState