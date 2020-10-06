const SET = "ducks/aggregation/SET"
const TOGGLE = "ducks/aggregation/TOGGLE"

export const toggleAggregationAction = aggregation => ({
    type: TOGGLE,
    aggregation: aggregation
});

export const setAggregationAction = id => ({
    type: SET,
    aggregation: id
});

const currentAggregation = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.aggregation
        case TOGGLE:
            var newState = state.slice(0)
            action.aggregation.forEach(vector => {
                if (newState.includes(vector)) {
                    newState.splice(newState.indexOf(vector), 1)
                } else {
                    newState.push(vector)
                }
            })
            return newState
        default:
            return state
    }
}

export default currentAggregation
