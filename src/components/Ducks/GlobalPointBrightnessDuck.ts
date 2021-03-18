const SET = "ducks/globalPointBrightness/SET"

export const setGlobalPointBrightness = globalPointBrightness => ({
    type: SET,
    globalPointBrightness: globalPointBrightness
});

const globalPointBrightness = (state = [1], action): number[] => {
    switch (action.type) {
        case SET:
            return action.globalPointBrightness
        default:
            return state
    }
}

export default globalPointBrightness