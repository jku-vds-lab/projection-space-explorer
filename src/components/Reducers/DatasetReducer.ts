

const dataset = (state = null, action) => {
    switch (action.type) {
        case 'SET_DATASET':
            return action.dataset
        default:
            return state
    }
}

export default dataset