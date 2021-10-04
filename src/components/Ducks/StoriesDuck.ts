import { getSyncNodesAlt } from "../NumTs/NumTs";
import { ACluster, ICluster } from "../../model/Cluster";
import { IEdge } from "../../model/Edge";
import { IBook, ABook } from "../../model/Book";
import { IVector } from "../../model/Vector";
import { v4 as uuidv4 } from 'uuid';
import { ObjectTypes } from "../../model/ObjectType";

const ADD_STORY_BOOK = "ducks/stories/ADD"
const DELETE = "ducks/stories/DELETE"
const SET = "ducks/stories/SET"
const ADD_CLUSTER_TO_ACTIVE = "ducks/stories/ADD_CLUSTER"
const SET_ACTIVE_STORY_BOOK = "ducks/stories/SET_ACTIVE"
const DELETE_CLUSTER = "ducks/stories/REMOVE_CLUSTER_FROM_STORIES"
const ADD_EDGE_TO_ACTIVE = "ducks/stories/ADD_EDGE_TO_ACTIVE"
const SET_ACTIVE_TRACE = "ducks/stories/SET_ACTIVE_TRACE"
const ADD_CLUSTER_TO_TRACE = "ducks/stories/ADD_CLUSTER_TO_TRACE"
const SET_ACTIVE_TRACE_STATE = "ducks/stories/SET_ACTIVE_TRACE_STATE"
const SELECT_SIDE_BRANCH = "ducks/stories/SELECT_SIDE_BRANCH"
const SET_VECTORS = "ducks/stories/SET_VECTORS"
const REMOVE_EDGE_FROM_ACTIVE = "ducks/stories/REMOVE_EDGE_FROM_ACTIVE"

export const addStory = (story, activate = false) => ({
    type: ADD_STORY_BOOK,
    story: story,
    activate: activate
});

export const deleteStory = story => ({
    type: DELETE,
    story: story
});

export function setStories(stories: IBook[]) {
    return {
        type: SET,
        stories: stories
    }
}


export const addClusterToStory = cluster => ({
    type: ADD_CLUSTER_TO_ACTIVE,
    cluster: cluster
})

export function setActiveStory(activeStory: IBook) {
    return {
        type: SET_ACTIVE_STORY_BOOK,
        activeStory: activeStory
    }
}

export function removeClusterFromStories(cluster: ICluster) {
    return {
        type: DELETE_CLUSTER,
        cluster: cluster
    }
}

export function addEdgeToActive(edge) {
    return {
        type: ADD_EDGE_TO_ACTIVE,
        edge: edge
    }
}

export function removeEdgeFromActive(edge) {
    return {
        type: REMOVE_EDGE_FROM_ACTIVE,
        edge: edge
    }
}

export const setActiveTrace = (activeTrace: number) => ({
    type: SET_ACTIVE_TRACE,
    activeTrace: activeTrace
})

export const addClusterToTrace = cluster => ({
    type: ADD_CLUSTER_TO_TRACE,
    cluster: cluster
})


export function setActiveTraceState(cluster: string) {
    return {
        type: SET_ACTIVE_TRACE_STATE,
        cluster: cluster
    }
}

export function selectSideBranch(i: number) {
    return {
        type: SELECT_SIDE_BRANCH,
        index: i
    }
}

export function setVectors(vectors: IVector[]) {
    return {
        type: SET_VECTORS,
        vectors: vectors
    }
}




export class StoriesUtil {
    static createEmpty(): StoriesType {
        return {
            vectors: [],
            stories: [],
            active: null,
            trace: null,
            activeTraceState: null
        }
    }

    static emptyStory(): IBook {
        const story: IBook = {
            clusters: {
                byId: {},
                allIds: []
            },
            edges: {
                byId: {},
                allIds: []
            }
        }

        return story
    }

    static getActive(stories: StoriesType): IBook {
        return stories.stories[stories.active]
    }

    static retrieveCluster(stories: StoriesType, clusterIndex: string): ICluster {
        return stories.stories[stories.active].clusters.byId[clusterIndex]
    }

    static retreiveEdge(stories: StoriesType, edgeIndex: string): IEdge {
        return stories.stories[stories.active].edges.byId[edgeIndex]
    }
}

const initialState = StoriesUtil.createEmpty()

/**
 * Type interface for stories slace of the redux store.
 */
export type StoriesType = {
    vectors: IVector[]

    stories: IBook[]

    active: number

    trace: { mainPath: string[], mainEdges: string[], sidePaths: { nodes: string[], edges: string[], syncNodes: number[] }[] }

    activeTraceState: string
}

export default function stories(state: StoriesType = initialState, action): StoriesType {
    switch (action.type) {
        case SET_VECTORS:
            let clone = Object.assign({}, state)
            clone.vectors = action.vectors
            return clone
        case SELECT_SIDE_BRANCH: {
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
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: trace,
                activeTraceState: state.activeTraceState
            }
        }
        case SET_ACTIVE_TRACE_STATE: {

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: action.cluster
            }
        }
        case ADD_CLUSTER_TO_TRACE: {
            let cluster = action.cluster

            // Add cluster to active story book
            const activeStory = StoriesUtil.getActive(state)

            ABook.addCluster(activeStory, cluster)

            // Add edge that connects the active trace state with the current cluster
            if (state.trace.mainPath.length > 0) {
                let edge: IEdge = {
                    source: state.trace.mainPath[state.trace.mainPath.length - 1],
                    destination: cluster,
                    objectType: ObjectTypes.Edge
                }

                const handle = ABook.addEdge(activeStory, edge)

                state.trace.mainEdges.push(handle)
            }

            // Add cluster to current trace
            state.trace.mainPath.push(cluster)

            ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(activeStory.clusters.byId))

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case SET_ACTIVE_TRACE: {
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: action.activeTrace,
                activeTraceState: state.activeTraceState
            }
        }
        case SET:
            if (state.active !== null) {
                ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(StoriesUtil.getActive(state).clusters.byId))
            }

            return {
                vectors: state.vectors,
                stories: action.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case DELETE:
            const newState = state.stories.slice(0)
            newState.splice(newState.indexOf(action.story), 1)

            if (state.active == action.story) {
                ACluster.deriveVectorLabelsFromClusters(state.vectors, [])

                return {
                    vectors: state.vectors,
                    stories: newState,
                    active: null,
                    trace: null,
                    activeTraceState: null
                }
            }

            return {
                vectors: state.vectors,
                stories: newState,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case ADD_STORY_BOOK: {
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

            ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(storyBook.clusters.byId))

            if (state && state.stories.length > 0) {
                const newState = state.stories.slice(0)
                const i = newState.push(storyBook) - 1

                return {
                    vectors: state.vectors,
                    stories: newState,
                    active: action.activate ? i : state.active,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            } else {
                return {
                    vectors: state.vectors,
                    stories: [storyBook],
                    active: 0,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            }
        }
        case SET_ACTIVE_STORY_BOOK: {
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
                ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(storyBook.clusters.byId))
            } else {
                ACluster.deriveVectorLabelsFromClusters(state.vectors, [])
            }

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: action.activeStory,
                trace: trace,
                activeTraceState: activeTraceState
            }
        }
        case DELETE_CLUSTER: {
            const cluster = action.cluster as ICluster

            const activeStory = StoriesUtil.getActive(state)

            const handle = ABook.deleteCluster(activeStory, cluster)

            const entries = Object.entries(activeStory.edges.byId).filter(([edgeHandle, edge]) => {
                return edge.source === handle || edge.destination === handle
            })

            for (const [handle, edge] of entries) {
                ABook.deleteEdge(activeStory, edge)
            }

            // Remove cluster labels from samples
            // TODO: check if this is ok in a reducer
            cluster.indices.map(i => state.vectors[i]).forEach(sample => {
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.splice(sample.groupLabel.indexOf(cluster.label), 1)
                } else {
                    sample.groupLabel = []
                }
            })

            console.log({
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            })

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ADD_EDGE_TO_ACTIVE: {
            const activeStory = StoriesUtil.getActive(state)
            const handle = uuidv4()
            activeStory.edges.byId[handle] = action.edge
            activeStory.edges.allIds.push(handle)

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ADD_CLUSTER_TO_ACTIVE: {
            let cluster = action.cluster as ICluster

            const story = StoriesUtil.getActive(state)

            ABook.addCluster(story, cluster)

            // Add cluster labels to samples
            // TODO: check if this is ok in a reducer
            cluster.indices.forEach(i => {
                const sample = state.vectors[i]
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.push(cluster.label)
                } else {
                    sample.groupLabel = [cluster.label]
                }
            })

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case REMOVE_EDGE_FROM_ACTIVE: {
            const activeStory = StoriesUtil.getActive(state)

            const handle = Object.keys(activeStory.edges.byId).find(handle => activeStory.edges.byId[handle] === action.edge)

            delete activeStory.edges.byId[handle]
            activeStory.edges.allIds.splice(activeStory.edges.allIds.indexOf(handle), 1)

            return { ...state }
        }
        default:
            return state
    }
}