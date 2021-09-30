import { result } from "lodash";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../Store/Store";
import { ICluster } from "../../model/Cluster";
import { IVector } from "../../model/Vector";
import { StoriesUtil } from "./StoriesDuck";




const THUNK_SET_VECTORS = "ducks/THUNK_SET"
const THUNK_SET_CLUSTERS = "ducks/THUNK_SET_CLUSTERS"


export const selectVectors = (selection: number[], shiftKey: boolean = false) => {
    return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
        const state: RootState = getState()

        const clusters = StoriesUtil.getActive(state.stories)?.clusters.byId

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

export const selectClusters = (selection: string[], shiftKey: boolean = false) => {
    return (dispatch, getState): ThunkAction<any, RootState, unknown, AnyAction> => {
        const state: RootState = getState()

        const vectors = state.dataset.vectors

        let newSelection = []

        if (shiftKey) {
            const selectionSet = new Set<string>(state.currentAggregation.selectedClusters)

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
            vectorSelection: deriveFromClusters(newSelection.map(i => StoriesUtil.getActive(state.stories).clusters.byId[i]))
        })
    }
}


function deriveFromClusters(clusters: ICluster[]): number[] {
    let agg = clusters.map(cluster => cluster.indices).flat()
    return [...new Set(agg)]
}

function deriveFromSamples(samples: IVector[], clusters: { [id: string]: ICluster }): number[] {
    if (!clusters) {
        return []
    }

    let labels = new Set()

    samples.forEach(sample => {
        sample.groupLabel.forEach(label => {
            labels.add(label)
        })
    })

    let arr = Array.from(labels)
    const result = []

    for (const [key, cluster] of Object.entries(clusters)) {
        if (arr.includes(cluster.label)) {
            result.push(key)
        }
    }

    return result
}

const initialState = {
    aggregation: [] as number[],
    selectedClusters: [] as string[],
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
