import Cluster from "../Utility/Data/Cluster";

const ADD = "ducks/currentClusters/ADD"
const SET = "ducks/currentClusters/SET"
const REMOVE = "ducks/currentClusters/REMOVE"


const initialState: Cluster[] = null

function currentClusters(state = initialState, action): Cluster[] {
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
                if (Array.isArray(sample.groupLabel)) {
                    if (!sample.groupLabel.includes(cluster.label)) {
                        sample.groupLabel.push(cluster.label)
                    }
                } else {
                    sample.groupLabel = [cluster.label]
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
                    if (Array.isArray(sample.groupLabel)) {
                        sample.groupLabel.splice(sample.groupLabel.indexOf(cluster.label), 1)
                    } else {
                        sample.groupLabel = []
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