const SET = "ducks/selectedLineBy/SET"
const OPT = "ducks/selectedLineBy/OPT"

export const setSelectedLineBy = lineBy => ({
    type: SET,
    value: lineBy
});

export const setLineByOptions = options => ({
    type: OPT,
    options: options
})

const initialState = {
    value: "",
    options: []
}

export function selectedLineBy(state = initialState, action) {
    switch (action.type) {
        case SET:
            return {
                options: state.options,
                value: action.value
            }
        case OPT:
            return {
                options: action.options,
                value: ""
            }
        default:
            return state;
    }
};

export default selectedLineBy