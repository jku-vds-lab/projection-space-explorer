const SET = "ducks/lineUpInput/SET"

export const setLineUpInput = input => ({
    type: SET,
    input: input
});

const lineUpInput = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.input
        default:
            return state
    }
}

export default lineUpInput