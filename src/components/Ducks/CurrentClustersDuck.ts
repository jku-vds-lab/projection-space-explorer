import Cluster from "../Utility/Data/Cluster";

const ADD = "ducks/currentClusters/ADD"
const SET = "ducks/currentClusters/SET"
const REMOVE = "ducks/currentClusters/REMOVE"

export const setCurrentClustersAction = currentClusters => ({
    type: SET,
    currentClusters: currentClusters
})

export const addCluster = (cluster: Cluster) => ({
    type: ADD,
    cluster: cluster
})

export const removeCluster = (cluster: Cluster) => ({
    type: REMOVE,
    cluster: cluster
})

const initialState: Cluster[] = null

export default function currentClusters(state = initialState, action): Cluster[] {
    switch (action.type) {
        case SET:
            return action.currentClusters
        case ADD: {
            let cluster = action.cluster
            let newState = state.slice(0)
            newState.push(action.cluster)

            // TODO: maybe should not be in a reducer
            // Add cluster label to vectors
            cluster.vectors.forEach(sample => {
                if (Array.isArray(sample.clusterLabel)) {
                    if (!sample.clusterLabel.includes(cluster.label)) {
                        sample.clusterLabel.push(cluster.label)
                    }
                } else {
                    sample.clusterLabel = [cluster.label]
                }
            })

            return newState
        }
        case REMOVE: {
            let cluster = action.cluster
            if (state.includes(cluster)) {
               
                let newState = state.slice(0)
                newState.splice(newState.indexOf(cluster), 1)


                // TODO: maybe should not be in a reduce
                // Remove cluster label from vectors
                cluster.vectors.forEach(sample => {
                    if (Array.isArray(sample.clusterLabel)) {
                        sample.clusterLabel.splice(sample.clusterLabel.indexOf(cluster.label), 1)
                    } else {
                        sample.clusterLabel = []
                    }
                })


                return newState
            } else {
                return state
            }
        }

        default:
            return state
    }
}