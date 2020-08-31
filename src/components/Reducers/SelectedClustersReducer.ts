import { ActionTypeLiteral } from "../Actions/Actions"

const selectedClusters = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetSelectedClusters:
            return action.selectedClusters
        case ActionTypeLiteral.ToggleSelectedCluster:
            console.log("reducer")
            console.log(state)
            console.log(state.slice(0))
            console.log(action.selectedCluster)
            var newState = state.slice(0)
            if (newState.includes(action.selectedCluster)) {
                newState.splice(newState.indexOf(action.selectedCluster), 1)
            } else {
                newState.push(action.selectedCluster)
            }
            console.log(newState)
            return newState
        default:
            return state
    }
}

export default selectedClusters