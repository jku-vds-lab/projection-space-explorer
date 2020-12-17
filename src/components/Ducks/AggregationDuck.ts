import { Vect } from "../Utility/Data/Vect";

const SET = "ducks/aggregation/SET"
const TOGGLE = "ducks/aggregation/TOGGLE"
const MERGE = "ducks/aggregation/MERGE"

export const toggleAggregationAction = aggregation => ({
    type: TOGGLE,
    aggregation: aggregation
});

export const setAggregationAction = samples => ({
    type: SET,
    aggregation: samples
});

export const mergeAggregation = (samples: Vect[]) => ({
    type: MERGE,
    samples: samples
})

const currentAggregation = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.aggregation
        case TOGGLE: {
            let newState = state.slice(0)
            action.aggregation.forEach(vector => {
                if (newState.includes(vector)) {
                    newState.splice(newState.indexOf(vector), 1)
                } else {
                    newState.push(vector)
                }
            })
            return newState
        }
        case MERGE: {
            let newState = state.slice(0)
            action.samples.forEach(sample => {
                if (!sample.view.selected) {
                    newState.push(sample)
                }
            })
            return state
        }
        default:
            return state
    }
}

export default currentAggregation
