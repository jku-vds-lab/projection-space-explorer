import Cluster from "../Utility/Data/Cluster";
import { Vect } from "../Utility/Data/Vect";

const SELECT_SAMPLES = "ducks/aggregation/SET"
const SELECT_GROUPS = "ducks/aggregation/SELECT_CLUSTER"

const TOGGLE = "ducks/aggregation/TOGGLE"
const MERGE = "ducks/aggregation/MERGE"

const SET_AVAILABLE_GROUPS = "ducks/aggregation/SET_GROUPS"

export const toggleAggregationAction = aggregation => ({
    type: TOGGLE,
    aggregation: aggregation
});

export const setAggregationAction = samples => ({
    type: SELECT_SAMPLES,
    aggregation: samples
});

export const aggSelectCluster = (cluster: Cluster, shiftKey: boolean) => ({
    type: SELECT_GROUPS,
    cluster: cluster,
    shiftKey: shiftKey
})

export const setAggregationGroups = (groups: Cluster[]) => ({
    type: SET_AVAILABLE_GROUPS,
    groups: groups
})


function deriveFromClusters(clusters: Cluster[]) {
    let agg = clusters.map(cluster => cluster.vectors).flat()
    return [...new Set(agg)]
}

function deriveFromSamples(samples: Vect[], clusters: Cluster[]) {
    let labels = new Set()

    samples.forEach(sample => {
        sample.groupLabel.forEach(label => {
            labels.add(label)
        })
    })

    let arr = Array.from(labels)

    return clusters.filter(cluster => {
        return arr.includes(cluster.label)
    })
}

const initialState = {
    aggregation: [] as Vect[],
    selectedClusters: [] as Cluster[],
    groups: [] as Cluster[],
    source: 'sample' as ('sample' | 'cluster')
}


const currentAggregation = (state = initialState, action): typeof initialState => {
    switch (action.type) {
        case SET_AVAILABLE_GROUPS:
            return { ... state, groups: action.groups }
        case SELECT_SAMPLES:
            return {
                aggregation: action.aggregation,
                selectedClusters: deriveFromSamples(action.aggregation, state.groups),
                groups: state.groups,
                source: 'sample'
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
                selectedClusters: deriveFromSamples(newState, state.groups),
                groups: state.groups,
                source: 'sample'
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
                aggregation: newState,
                selectedClusters: deriveFromSamples(newState, state.groups),
                groups: state.groups,
                source: 'sample'
            }
        }
        case SELECT_GROUPS: {
            if (action.shiftKey) {
                var newState = state.selectedClusters.slice(0)
                if (newState.includes(action.cluster)) {
                    newState.splice(newState.indexOf(action.cluster), 1)
                } else {
                    newState.push(action.cluster)
                }
                return {
                    aggregation: deriveFromClusters(newState),
                    selectedClusters: newState,
                    groups: state.groups,
                    source: 'cluster'
                }
            } else {
                return {
                    selectedClusters: [action.cluster],
                    aggregation: [...action.cluster.vectors],
                    groups: state.groups,
                    source: 'cluster'
                }
            }
        }
        default:
            return state
    }
}

export default currentAggregation
