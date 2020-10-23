import Cluster from "../util/Cluster";


const SET = "ducks/currentClusters/SET"

export const setCurrentClustersAction = currentClusters => ({
    type: SET,
    currentClusters: currentClusters
});

const initialState: Cluster[] = null

export default function currentClusters (state = initialState, action): Cluster[] {
    switch (action.type) {
        case SET:
            return action.currentClusters
        default:
            return state
    }
}