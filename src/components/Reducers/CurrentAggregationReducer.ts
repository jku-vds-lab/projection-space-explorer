const currentAggregation = (state = [], action) => {
    switch (action.type) {
        case 'SET_AGGREGATION':
            return action.aggregation
        default:
            return state
    }
}

export default currentAggregation