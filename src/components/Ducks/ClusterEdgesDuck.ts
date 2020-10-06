const SET = "ducks/clusterEdges/SET"

export const setClusterEdgesAction = clusterEdges => ({
    type: SET,
    clusterEdges: clusterEdges
});

const clusterEdges = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.clusterEdges
        default:
            return state
    }
}

export default clusterEdges