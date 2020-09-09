import { ActionTypeLiteral } from "../Actions/Actions"
import { CineonToneMapping } from "three"

const currentAggregation = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetAggregation:
            return action.aggregation
        case ActionTypeLiteral.ToggleAggregation:
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