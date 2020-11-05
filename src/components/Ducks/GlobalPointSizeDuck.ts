const SET = "ducks/globalPointSize/SET"

export const setGlobalPointSize = globalPointSize => ({
    type: SET,
    globalPointSize: globalPointSize
});

const globalPointSize = (state = [1], action): number[] => {
    switch (action.type) {
        case SET:
            return action.globalPointSize
        default:
            return state
    }
}

export default globalPointSize