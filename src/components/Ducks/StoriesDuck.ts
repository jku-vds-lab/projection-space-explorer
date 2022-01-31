import { getSyncNodesAlt } from "../NumTs/NumTs";
import { ACluster, ICluster } from "../../model/Cluster";
import { IEdge } from "../../model/Edge";
import { IBook, ABook } from "../../model/Book";
import { ObjectTypes } from "../../model/ObjectType";
import { ANormalized } from "../Utility/NormalizedState";
import { RootState } from "../Store";


const enum ActionTypes {
    ADD_BOOK = "ducks/stories/ADD",
    DELETE_BOOK = "ducks/stories/DELETE",

    ADD_CLUSTER = "ducks/stories/ADD_CLUSTER",
    DELETE_CLUSTER = "ducks/stories/REMOVE_CLUSTER_FROM_STORIES",

    SET = "ducks/stories/SET",

    SET_ACTIVE_STORY_BOOK = "ducks/stories/SET_ACTIVE",

    ADD_EDGE_TO_ACTIVE = "ducks/stories/ADD_EDGE_TO_ACTIVE",
    SET_ACTIVE_TRACE = "ducks/stories/SET_ACTIVE_TRACE",
    ADD_CLUSTER_TO_TRACE = "ducks/stories/ADD_CLUSTER_TO_TRACE",
    SET_ACTIVE_TRACE_STATE = "ducks/stories/SET_ACTIVE_TRACE_STATE",
    SELECT_SIDE_BRANCH = "ducks/stories/SELECT_SIDE_BRANCH",
    REMOVE_EDGE_FROM_ACTIVE = "ducks/stories/REMOVE_EDGE_FROM_ACTIVE"
}


/**type AddStoryAction = {
    type: ActionTypes.ADD_STORY_BOOK
    story: IBook
    activate: boolean
}**/

//type Action = AddStoryAction

export function addBook(story: IBook, activate: boolean = false) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.ADD_BOOK,
            story: story,
            activate: activate,
            vectors: dataset.vectors
        })
    }
}


export function deleteBook(story: IBook) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.DELETE_BOOK,
            story: story,
            vectors: dataset.vectors
        })
    }
}





export function addCluster(cluster: ICluster) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.ADD_CLUSTER,
            cluster: cluster,
            vectors: dataset.vectors
        })
    }
}

export function deleteCluster(cluster: ICluster) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.DELETE_CLUSTER,
            cluster: cluster,
            vectors: dataset.vectors
        })
    }
}







export function setStories(stories: IBook[]) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.SET,
            stories: stories,
            vectors: dataset.vectors
        })
    }
}




export function setActiveStory(activeStory: IBook) {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.SET_ACTIVE_STORY_BOOK,
            activeStory: activeStory,
            vectors: dataset.vectors
        })
    }
}



export function addEdgeToActive(edge) {
    return {
        type: ActionTypes.ADD_EDGE_TO_ACTIVE,
        edge: edge
    }
}

export function removeEdgeFromActive(edge) {
    return {
        type: ActionTypes.REMOVE_EDGE_FROM_ACTIVE,
        edge: edge
    }
}

export const setActiveTrace = (activeTrace: number) => ({
    type: ActionTypes.SET_ACTIVE_TRACE,
    activeTrace: activeTrace
})


export const addClusterToTrace = (cluster) => {
    return (dispatch, getState) => {
        const { dataset } = getState() as RootState

        return dispatch({
            type: ActionTypes.ADD_CLUSTER_TO_TRACE,
            cluster: cluster,
            vectors: dataset.vectors
        })
    }
}


export function setActiveTraceState(cluster: string) {
    return {
        type: ActionTypes.SET_ACTIVE_TRACE_STATE,
        cluster: cluster
    }
}

export function selectSideBranch(i: number) {
    return {
        type: ActionTypes.SELECT_SIDE_BRANCH,
        index: i
    }
}


export class AStorytelling {
    static createEmpty(): IStorytelling {
        return {
            stories: [],
            active: null,
            trace: null,
            activeTraceState: null
        }
    }

    static emptyStory(): IBook {
        const story: IBook = {
            clusters: ANormalized.create<ICluster>(),
            edges: ANormalized.create<IEdge>()
        }

        return story
    }

    static getActive(stories: IStorytelling): IBook {
        if (stories && stories.stories) {
            return stories.stories[stories.active]
        } else {
            return null
        }
    }

    static retrieveCluster(stories: IStorytelling, clusterIndex: string): ICluster {
        return stories.stories[stories.active].clusters.byId[clusterIndex]
    }

    static retreiveEdge(stories: IStorytelling, edgeIndex: string): IEdge {
        return stories.stories[stories.active].edges.byId[edgeIndex]
    }
}

const initialState = AStorytelling.createEmpty()

/**
 * Type interface for stories slace of the redux store.
 */
export type IStorytelling = {
    stories: IBook[]

    active: number

    trace: { mainPath: string[], mainEdges: string[], sidePaths: { nodes: string[], edges: string[], syncNodes: number[] }[] }

    activeTraceState: string
}

export default function stories(state: IStorytelling = initialState, action): IStorytelling {
    switch (action.type) {
        case ActionTypes.SELECT_SIDE_BRANCH: {
            let sidePaths = state.trace.sidePaths.slice(0)

            sidePaths.splice(action.index, 1)
            sidePaths.push({
                nodes: state.trace.mainPath,
                edges: state.trace.mainEdges,
                syncNodes: []
            })

            let trace = {
                mainPath: state.trace.sidePaths[action.index].nodes,
                mainEdges: state.trace.sidePaths[action.index].edges,
                sidePaths: sidePaths
            }

            trace.sidePaths.forEach(sidePath => {
                sidePath.syncNodes = getSyncNodesAlt(trace.mainPath, sidePath.nodes)
            })

            return {
                stories: state.stories,
                active: state.active,
                trace: trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.SET_ACTIVE_TRACE_STATE: {

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: action.cluster
            }
        }
        case ActionTypes.ADD_CLUSTER_TO_TRACE: {
            let cluster = action.cluster

            // Add cluster to active story book
            const activeStory = AStorytelling.getActive(state)
            const addedHandle = ABook.addCluster(activeStory, cluster)

            // Add edge that connects the active trace state with the current cluster
            if (state.trace.mainPath.length > 0) {
                let edge: IEdge = {
                    source: state.trace.mainPath[state.trace.mainPath.length - 1],
                    destination: addedHandle,
                    objectType: ObjectTypes.Edge
                }

                const handle = ABook.addEdge(activeStory, edge)

                state.trace.mainEdges.push(handle)
            }

            // Add cluster to current trace
            state.trace.mainPath.push(addedHandle)

            ACluster.deriveVectorLabelsFromClusters(action.vectors, Object.values(activeStory.clusters.byId))


            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.SET_ACTIVE_TRACE: {
            return {
                stories: state.stories,
                active: state.active,
                trace: action.activeTrace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.SET:
            if (state.active !== null) {
                ACluster.deriveVectorLabelsFromClusters(action.vectors, Object.values(AStorytelling.getActive(state).clusters.byId))
            }

            return {
                stories: action.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case ActionTypes.DELETE_BOOK:
            const newState = state.stories.slice(0)
            newState.splice(newState.indexOf(action.story), 1)

            if (state.active == action.story) {
                ACluster.deriveVectorLabelsFromClusters(action.vectors, [])

                return {
                    stories: newState,
                    active: null,
                    trace: null,
                    activeTraceState: null
                }
            }

            return {
                stories: newState,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case ActionTypes.ADD_BOOK: {
            let storyBook = action.story as IBook
            let trace = state.trace
            let activeTraceState = state.activeTraceState


            if (storyBook.clusters.allIds.length == 0) {
                trace = {
                    mainEdges: [],
                    mainPath: [],
                    sidePaths: []
                }
                activeTraceState = null
            }

            ACluster.deriveVectorLabelsFromClusters(action.vectors, Object.values(storyBook.clusters.byId))

            if (state && state.stories.length > 0) {
                const newState = state.stories.slice(0)
                const i = newState.push(storyBook) - 1

                return {
                    stories: newState,
                    active: action.activate ? i : state.active,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            } else {
                return {
                    stories: [storyBook],
                    active: 0,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            }
        }
        case ActionTypes.SET_ACTIVE_STORY_BOOK: {
            let storyBook = state.stories[action.activeStory]

            let trace = state.trace
            let activeTraceState = state.activeTraceState

            if (storyBook && storyBook.clusters.allIds.length == 0) {
                trace = {
                    mainPath: [],
                    mainEdges: [],
                    sidePaths: []
                }
                activeTraceState = null
            } else {
                trace = null
            }

            if (storyBook && storyBook.clusters) {
                ACluster.deriveVectorLabelsFromClusters(action.vectors, Object.values(storyBook.clusters.byId))
            } else {
                ACluster.deriveVectorLabelsFromClusters(action.vectors, [])
            }

            return {
                stories: state.stories,
                active: action.activeStory,
                trace: trace,
                activeTraceState: activeTraceState
            }
        }
        case ActionTypes.DELETE_CLUSTER: {
            const cluster = action.cluster as ICluster

            const activeStory = AStorytelling.getActive(state)

            const handle = ABook.deleteCluster(activeStory, cluster)

            const entries = Object.entries(activeStory.edges.byId).filter(([edgeHandle, edge]) => {
                return edge.source === handle || edge.destination === handle
            })

            for (const [handle, edge] of entries) {
                ABook.deleteEdge(activeStory, edge)
            }

            // Remove cluster labels from samples
            // TODO: check if this is ok in a reducer
            cluster.indices.map(i => action.vectors[i]).forEach(sample => {
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.splice(sample.groupLabel.indexOf(cluster.label), 1)
                } else {
                    sample.groupLabel = []
                }
            })

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.ADD_EDGE_TO_ACTIVE: {
            const activeStory = AStorytelling.getActive(state)

            ANormalized.add(activeStory.edges, action.edge)

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.ADD_CLUSTER: {
            let cluster = action.cluster as ICluster

            const story = AStorytelling.getActive(state)

            ABook.addCluster(story, cluster)

            // Add cluster labels to samples
            // TODO: check if this is ok in a reducer
            cluster.indices.forEach(i => {
                const sample = action.vectors[i]
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.push(cluster.label)
                } else {
                    sample.groupLabel = [cluster.label]
                }
            })

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ActionTypes.REMOVE_EDGE_FROM_ACTIVE: {
            const activeStory = AStorytelling.getActive(state)
            ANormalized.deleteByRef(activeStory.edges, action.edge)

            return { ...state }
        }
        default:
            return state
    }
}