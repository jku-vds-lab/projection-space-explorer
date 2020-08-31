import { ActionTypeLiteral } from "../Actions/Actions"

const currentAggregation = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetAggregation:
            return action.aggregation
        default:
            return state
    }
}

export default currentAggregation