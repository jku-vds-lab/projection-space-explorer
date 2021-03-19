import Cluster from "../Utility/Data/Cluster";
import { Vect } from "../Utility/Data/Vect";

const SET = "ducks/aggregation/SET"
const TOGGLE = "ducks/aggregation/TOGGLE"
const MERGE = "ducks/aggregation/MERGE"
const SELECT_CLUSTER = "ducks/aggregation/SELECT_CLUSTER"

export const toggleAggregationAction = aggregation => ({
    type: TOGGLE,
    aggregation: aggregation
});

export const setAggregationAction = samples => ({
    type: SET,
    aggregation: samples
});

export const mergeAggregation = (samples: Vect[]) => ({
    type: MERGE,
    samples: samples
})

export const aggSelectCluster = (cluster: Cluster, shiftKey: boolean) => ({
    type: SELECT_CLUSTER,
    cluster: cluster,
    shiftKey: shiftKey
})


function deriveFromClusters(clusters: Cluster[]) {
    let agg = clusters.map(cluster => cluster.vectors).flat()
    return [...new Set(agg)]
}

const currentAggregation = (state = { aggregation: [], selectedClusters: [] }, action) => {
    switch (action.type) {
        case SET:
            return {
                aggregation: action.aggregation,
                selectedClusters: []
            }
        case TOGGLE: {
            let newState = state.aggregation.slice(0)
            action.aggregation.forEach(vector => {
                if (newState.includes(vector)) {
                    newState.splice(newState.indexOf(vector), 1)
                } else {
                    newState.push(vector)
                }
            })
            return {
                aggregation: newState,
                selectedClusters: []
            }
        }
        case MERGE: {
            let newState = state.aggregation.slice(0)
            action.samples.forEach(sample => {
                if (!sample.view.selected) {
                    newState.push(sample)
                }
            })
            return {
                aggregation: state,
                selectedClusters: []
            }
        }
        case SELECT_CLUSTER: {
            if (action.shiftKey) {
                var newState = state.selectedClusters.slice(0)
                if (newState.includes(action.cluster)) {
                    newState.splice(newState.indexOf(action.cluster), 1)
                } else {
                    newState.push(action.cluster)
                }
                return {
                    aggregation: deriveFromClusters(newState),
                    selectedClusters: newState
                }
            } else {
                return {
                    selectedClusters: [action.cluster],
                    aggregation: [...action.cluster.vectors]
                }
            }
        }
        default:
            return state
    }
}

export default currentAggregation
