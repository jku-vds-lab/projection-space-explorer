const clusterEdges = (state = [], action) => {
    switch (action.type) {
        case 'SET_CLUSTER_EDGES':
            return action.clusterEdges
        default:
            return state
    }
}

export default clusterEdges