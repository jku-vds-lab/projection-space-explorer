import { getSyncNodesAlt } from "../NumTs/NumTs";
import Cluster, { ClusterObject, ICluster } from "../Utility/Data/Cluster";
import { Edge } from "../Utility/graphs";
import { Storybook } from "../Utility/Data/Storybook";
import { Vect } from "../Utility/Data/Vect";

const ADD_STORY_BOOK = "ducks/stories/ADD"
const DELETE = "ducks/stories/DELETE"
const SET = "ducks/stories/SET"
const ADD_CLUSTER_TO_ACTIVE = "ducks/stories/ADD_CLUSTER"
const SET_ACTIVE_STORY_BOOK = "ducks/stories/SET_ACTIVE"
const REMOVE_CLUSTER_FROM_STORIES = "ducks/stories/REMOVE_CLUSTER_FROM_STORIES"
const ADD_EDGE_TO_ACTIVE = "ducks/stories/ADD_EDGE_TO_ACTIVE"
const SET_ACTIVE_TRACE = "ducks/stories/SET_ACTIVE_TRACE"
const ADD_CLUSTER_TO_TRACE = "ducks/stories/ADD_CLUSTER_TO_TRACE"
const SET_ACTIVE_TRACE_STATE = "ducks/stories/SET_ACTIVE_TRACE_STATE"
const SELECT_SIDE_BRANCH = "ducks/stories/SELECT_SIDE_BRANCH"
const SET_VECTORS = "ducks/stories/SET_VECTORS"
const REMOVE_EDGE_FROM_ACTIVE = "ducks/stories/REMOVE_EDGE_FROM_ACTIVE"

export const addStory = story => ({
    type: ADD_STORY_BOOK,
    story: story
});

export const deleteStory = story => ({
    type: DELETE,
    story: story
});

export function setStories(stories: Storybook[]) {
    return {
        type: SET,
        stories: stories
    }
}


export const addClusterToStory = cluster => ({
    type: ADD_CLUSTER_TO_ACTIVE,
    cluster: cluster
})

export function setActiveStory(activeStory: Storybook) {
    return {
        type: SET_ACTIVE_STORY_BOOK,
        activeStory: activeStory
    }
}

export function removeClusterFromStories(cluster: Cluster) {
    return {
        type: REMOVE_CLUSTER_FROM_STORIES,
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

export const setActiveTrace = activeTrace => ({
    type: SET_ACTIVE_TRACE,
    activeTrace: activeTrace
})

export const addClusterToTrace = cluster => ({
    type: ADD_CLUSTER_TO_TRACE,
    cluster: cluster
})


export function setActiveTraceState(cluster: Cluster) {
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

export function setVectors(vectors: Vect[]) {
    return {
        type: SET_VECTORS,
        vectors: vectors
    }
}

const initialState = {
    vectors: [],
    stories: [],
    active: null,
    trace: null,
    activeTraceState: null
}

export type StoriesType = {
    vectors: Vect[]

    stories: Storybook[]

    active: Storybook

    trace: { mainPath: ICluster[], mainEdges: any[], sidePaths: { nodes: ICluster[], edges: Edge[], syncNodes: number[] }[] }

    activeTraceState: ICluster
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
            sidePaths.push({ nodes: state.trace.mainPath, edges: state.trace.mainEdges, syncNodes: [] })

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
            state.active.clusters.push(cluster)

            // Add edge that connects the active trace state with the current cluster
            if (state.trace.mainPath.length > 0) {
                let edge = new Edge(state.trace.mainPath[state.trace.mainPath.length - 1], cluster, null)
                state.active.edges.push(edge)
                state.trace.mainEdges.push(edge)
            }

            // Add cluster to current trace
            state.trace.mainPath.push(cluster)

            ClusterObject.deriveVectorLabelsFromClusters(state.vectors, state.active.clusters)

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
            if (state.active) {
                ClusterObject.deriveVectorLabelsFromClusters(state.vectors, state.active.clusters)
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
                ClusterObject.deriveVectorLabelsFromClusters(state.vectors, [])

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
            let storyBook = action.story as Storybook
            let trace = state.trace
            let activeTraceState = state.activeTraceState

            if (storyBook.clusters.length == 0) {
                trace = {
                    mainEdges: [],
                    mainPath: [],
                    sidePaths: []
                }
                activeTraceState = null
            }

            ClusterObject.deriveVectorLabelsFromClusters(state.vectors, storyBook.clusters)

            if (state && state.stories.length > 0) {
                const newState = state.stories.slice(0)
                newState.push(storyBook)

                return {
                    vectors: state.vectors,
                    stories: newState,
                    active: storyBook,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            } else {
                return {
                    vectors: state.vectors,
                    stories: [storyBook],
                    active: storyBook,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            }
        }
        case SET_ACTIVE_STORY_BOOK: {
            let storyBook = action.activeStory as Storybook

            let trace = state.trace
            let activeTraceState = state.activeTraceState
            if (storyBook && storyBook.clusters.length == 0) {
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
                ClusterObject.deriveVectorLabelsFromClusters(state.vectors, storyBook.clusters)
            } else {
                ClusterObject.deriveVectorLabelsFromClusters(state.vectors, [])
            }
            
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: action.activeStory,
                trace: trace,
                activeTraceState: activeTraceState
            }
        }
        case REMOVE_CLUSTER_FROM_STORIES: {
            let cluster = action.cluster as ICluster

            // Find stories where the cluster is located
            state.stories.forEach(story => {
                if (story.clusters.includes(cluster)) {
                    story.clusters.splice(story.clusters.indexOf(cluster), 1)

                    story.edges.filter(edge => {
                        return edge.source == cluster || edge.destination == cluster
                    }).forEach(edge => {
                        story.edges.splice(story.edges.indexOf(edge), 1)
                    })
                }
            })

            // Remove cluster labels from samples
            // TODO: check if this is ok in a reducer
            cluster.refactored.map(i => state.vectors[i]).forEach(sample => {
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.splice(sample.groupLabel.indexOf(cluster.label), 1)
                } else {
                    sample.groupLabel = []
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
        case ADD_EDGE_TO_ACTIVE: {
            state.active.edges.push(action.edge)

            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ADD_CLUSTER_TO_ACTIVE: {
            let cluster = action.cluster

            state.active.clusters.push(cluster)

            // Add cluster labels to samples
            // TODO: check if this is ok in a reducer
            cluster.vectors.forEach(sample => {
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
            state.active.edges.splice(state.active.edges.indexOf(action.edge), 1)

            return { ... state }
        }
        default:
            return state
    }
}