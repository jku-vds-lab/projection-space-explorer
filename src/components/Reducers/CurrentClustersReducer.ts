import { ActionTypeLiteral } from "../Actions/Actions"

const currentClusters = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetCurrentClusters:
            return action.currentClusters
        default:
            return state
    }
}

export default currentClusters