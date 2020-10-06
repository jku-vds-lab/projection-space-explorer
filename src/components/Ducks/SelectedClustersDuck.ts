const SET = "ducks/selectedClusters/SET"
const TOGGLE = "ducks/selectedClusters/TOGGLE"


export const toggleSelectedCluster = selectedCluster => ({
    type: TOGGLE,
    selectedCluster: selectedCluster
});

export const setSelectedClusters = selectedClusters => ({
    type: SET,
    selectedClusters: selectedClusters
});

const selectedClusters = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.selectedClusters
        case TOGGLE:
            var newState = state.slice(0)
            if (newState.includes(action.selectedCluster)) {
                newState.splice(newState.indexOf(action.selectedCluster), 1)
            } else {
                newState.push(action.selectedCluster)
            }
            return newState
        default:
            return state
    }
}

export default selectedClusters