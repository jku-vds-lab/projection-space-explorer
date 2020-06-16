const currentClusters = (state = [], action) => {
    switch (action.type) {
        case 'SET_CURRENT_CLUSTERS':
            return action.currentClusters
        default:
            return state
    }
}

export default currentClusters