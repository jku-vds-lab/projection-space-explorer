import { ActionTypeLiteral } from "../Actions/Actions"

const clusterEdges = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetClusterEdges:
            return action.clusterEdges
        default:
            return state
    }
}

export default clusterEdges