const SET = "ducks/database/SET"

export const setDatasetAction = dataset => ({
    type: SET,
    dataset: dataset
});

const dataset = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.dataset
        default:
            return state
    }
}

export default dataset