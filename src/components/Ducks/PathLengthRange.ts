const SET = "ducks/pathLengthRange/SET"
const SET_MAX = "ducks/pathLengthRange/SET_MAX"

export const setPathLengthRange = pathLengthRange => ({
    type: SET,
    range: pathLengthRange
});

export const setPathLengthMaximum = pathLengthMaximum => ({
    type: SET_MAX,
    maximum: pathLengthMaximum
})

const pathLengthRange = (state = { range: [0, 100], maximum: 100 }, action) => {
    switch (action.type) {
        case SET:
            return {
                range: action.range,
                maximum: state.maximum
            }
        case SET_MAX:
            return {
                range: state.range,
                maximum: action.maximum
            }
        default:
            return state
    }
}

export default pathLengthRange