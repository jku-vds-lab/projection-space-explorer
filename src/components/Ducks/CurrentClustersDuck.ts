const SET = "ducks/currentClusters/SET"

export const setCurrentClustersAction = currentClusters => ({
    type: SET,
    currentClusters: currentClusters
});

const currentClusters = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.currentClusters
        default:
            return state
    }
}

export default currentClusters