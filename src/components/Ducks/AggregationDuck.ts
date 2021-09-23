import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../Store/Store";
import { ICluster } from "../Utility/Data/Cluster";
import { IVect } from "../Utility/Data/Vect";
import { StoriesUtil } from "./StoriesDuck";




const THUNK_SET_VECTORS = "ducks/THUNK_SET"
const THUNK_SET_CLUSTERS = "ducks/THUNK_SET_CLUSTERS"


export const selectVectors = (selection: number[], shiftKey: boolean = false) => {
    return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
        const state: RootState = getState()

        const clusters = StoriesUtil.getActive(state.stories)?.clusters ?? []

        let newSelection = []

        if (shiftKey) {
            const selectionSet = new Set(state.currentAggregation.aggregation)

            selection.forEach(index => {
                if (selectionSet.has(index)) {
                    selectionSet.delete(index)
                } else {
                    selectionSet.add(index)
                }
            })

            newSelection = [...selectionSet]
        } else {
            newSelection = [...selection]
        }

        return dispatch({
            type: THUNK_SET_VECTORS,
            clusterSelection: deriveFromSamples(newSelection.map(i => state.dataset.vectors[i]), clusters),
            vectorSelection: newSelection
        })
    }
}

export const selectClusters = (selection: number[], shiftKey: boolean = false) => {
    return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
        const state: RootState = getState()

        const vectors = state.dataset.vectors

        let newSelection = []

        if (shiftKey) {
            const selectionSet = new Set(state.currentAggregation.selectedClusters)

            selection.forEach(index => {
                if (selectionSet.has(index)) {
                    selectionSet.delete(index)
                } else {
                    selectionSet.add(index)
                }
            })

            newSelection = [...selectionSet]
        } else {
            newSelection = [...selection]
        }


        return dispatch({
            type: THUNK_SET_CLUSTERS,
            clusterSelection: newSelection,
            vectorSelection: deriveFromClusters(newSelection.map(i => StoriesUtil.getActive(state.stories).clusters[i]))
        })
    }
}


function deriveFromClusters(clusters: ICluster[]): number[] {
    let agg = clusters.map(cluster => cluster.refactored).flat()
    return [...new Set(agg)]
}

function deriveFromSamples(samples: IVect[], clusters: ICluster[]): number[] {
    let labels = new Set()

    samples.forEach(sample => {
        sample.groupLabel.forEach(label => {
            labels.add(label)
        })
    })

    let arr = Array.from(labels)

    return clusters.filter(cluster => {
        return arr.includes(cluster.label)
    }).map(c => clusters.indexOf(c))
}

const initialState = {
    aggregation: [] as number[],
    selectedClusters: [] as number[],
    source: 'sample' as ('sample' | 'cluster')
}


const currentAggregation = (state = initialState, action): typeof initialState => {
    switch (action.type) {
        case THUNK_SET_VECTORS: {
            return {
                aggregation: action.vectorSelection,
                selectedClusters: action.clusterSelection,
                source: 'sample'
            }
        }
        case THUNK_SET_CLUSTERS: {
            return {
                aggregation: action.vectorSelection,
                selectedClusters: action.clusterSelection,
                source: 'cluster'
            }
        }
        default:
            return state
    }
}

export default currentAggregation
