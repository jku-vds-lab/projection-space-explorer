import Cluster from "../util/Cluster";
import { Edge } from "../util/graphs";
import { Story } from "../util/Story";

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

export const addStory = story => ({
    type: ADD_STORY_BOOK,
    story: story
});

export const deleteStory = story => ({
    type: DELETE,
    story: story
});

export function setStories(stories: Story[]) {
    return {
        type: SET,
        stories: stories
    }
}


export const addClusterToStory = cluster => ({
    type: ADD_CLUSTER_TO_ACTIVE,
    cluster: cluster
})

export function setActiveStory(activeStory: Story) {
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

const initialState = {
    stories: [],
    active: null,
    trace: null,
    activeTraceState: null
}

type StoriesType = {
    stories: Story[]
    active: Story
    trace: { mainPath: Cluster[], mainEdges: any[], sidePaths: any[] }
    activeTraceState: Cluster
}

export default function stories(state: StoriesType = initialState, action): StoriesType {
    switch (action.type) {
        case SET_ACTIVE_TRACE_STATE: {
            return {
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

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case SET_ACTIVE_TRACE: {
            return {
                stories: state.stories,
                active: state.active,
                trace: action.activeTrace,
                activeTraceState: state.activeTraceState
            }
        }
        case SET:
            return {
                stories: action.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case DELETE:
            const newState = state.stories.slice(0)
            newState.splice(newState.indexOf(action.story), 1)
            return {
                stories: newState,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        case ADD_STORY_BOOK: {
            let storyBook = action.story as Story
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

            if (state && state.stories.length > 0) {
                const newState = state.stories.slice(0)
                newState.push(storyBook)

                return {
                    stories: newState,
                    active: storyBook,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            } else {
                return {
                    stories: [storyBook],
                    active: storyBook,
                    trace: trace,
                    activeTraceState: activeTraceState
                }
            }
        }
        case SET_ACTIVE_STORY_BOOK: {
            let storyBook = action.activeStory as Story

            

            let trace = state.trace
            let activeTraceState = state.activeTraceState
            if (storyBook && storyBook.clusters.length == 0) {
                trace = {
                    mainPath: [],
                    mainEdges: [],
                    sidePaths: []
                }
                activeTraceState = null
            }

            return {
                stories: state.stories,
                active: action.activeStory,
                trace: trace,
                activeTraceState: activeTraceState
            }
        }
        case REMOVE_CLUSTER_FROM_STORIES: {
            let cluster = action.cluster

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
            cluster.vectors.forEach(sample => {
                if (Array.isArray(sample.clusterLabel)) {
                    sample.clusterLabel.splice(sample.clusterLabel.indexOf(cluster.label), 1)
                } else {
                    sample.clusterLabel = []
                }
            })

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        case ADD_EDGE_TO_ACTIVE: {
            state.active.edges.push(action.edge)

            return {
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
                if (Array.isArray(sample.clusterLabel)) {
                    sample.clusterLabel.push(cluster.label)
                } else {
                    sample.clusterLabel = [cluster.label]
                }
            })

            return {
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            }
        }
        default:
            return state
    }
}