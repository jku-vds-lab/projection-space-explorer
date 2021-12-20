"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumTs_1 = require("../NumTs/NumTs");
const Cluster_1 = require("../../model/Cluster");
const Book_1 = require("../../model/Book");
const uuid_1 = require("uuid");
const ObjectType_1 = require("../../model/ObjectType");
const ADD_STORY_BOOK = "ducks/stories/ADD";
const DELETE = "ducks/stories/DELETE";
const SET = "ducks/stories/SET";
const ADD_CLUSTER_TO_ACTIVE = "ducks/stories/ADD_CLUSTER";
const SET_ACTIVE_STORY_BOOK = "ducks/stories/SET_ACTIVE";
const DELETE_CLUSTER = "ducks/stories/REMOVE_CLUSTER_FROM_STORIES";
const ADD_EDGE_TO_ACTIVE = "ducks/stories/ADD_EDGE_TO_ACTIVE";
const SET_ACTIVE_TRACE = "ducks/stories/SET_ACTIVE_TRACE";
const ADD_CLUSTER_TO_TRACE = "ducks/stories/ADD_CLUSTER_TO_TRACE";
const SET_ACTIVE_TRACE_STATE = "ducks/stories/SET_ACTIVE_TRACE_STATE";
const SELECT_SIDE_BRANCH = "ducks/stories/SELECT_SIDE_BRANCH";
const SET_VECTORS = "ducks/stories/SET_VECTORS";
const REMOVE_EDGE_FROM_ACTIVE = "ducks/stories/REMOVE_EDGE_FROM_ACTIVE";
exports.addStory = (story, activate = false) => ({
    type: ADD_STORY_BOOK,
    story: story,
    activate: activate
});
exports.deleteStory = story => ({
    type: DELETE,
    story: story
});
function setStories(stories) {
    return {
        type: SET,
        stories: stories
    };
}
exports.setStories = setStories;
exports.addClusterToStory = cluster => ({
    type: ADD_CLUSTER_TO_ACTIVE,
    cluster: cluster
});
function setActiveStory(activeStory) {
    return {
        type: SET_ACTIVE_STORY_BOOK,
        activeStory: activeStory
    };
}
exports.setActiveStory = setActiveStory;
function removeClusterFromStories(cluster) {
    return {
        type: DELETE_CLUSTER,
        cluster: cluster
    };
}
exports.removeClusterFromStories = removeClusterFromStories;
function addEdgeToActive(edge) {
    return {
        type: ADD_EDGE_TO_ACTIVE,
        edge: edge
    };
}
exports.addEdgeToActive = addEdgeToActive;
function removeEdgeFromActive(edge) {
    return {
        type: REMOVE_EDGE_FROM_ACTIVE,
        edge: edge
    };
}
exports.removeEdgeFromActive = removeEdgeFromActive;
exports.setActiveTrace = (activeTrace) => ({
    type: SET_ACTIVE_TRACE,
    activeTrace: activeTrace
});
exports.addClusterToTrace = cluster => ({
    type: ADD_CLUSTER_TO_TRACE,
    cluster: cluster
});
function setActiveTraceState(cluster) {
    return {
        type: SET_ACTIVE_TRACE_STATE,
        cluster: cluster
    };
}
exports.setActiveTraceState = setActiveTraceState;
function selectSideBranch(i) {
    return {
        type: SELECT_SIDE_BRANCH,
        index: i
    };
}
exports.selectSideBranch = selectSideBranch;
function setVectors(vectors) {
    return {
        type: SET_VECTORS,
        vectors: vectors
    };
}
exports.setVectors = setVectors;
class StoriesUtil {
    static createEmpty() {
        return {
            vectors: [],
            stories: [],
            active: null,
            trace: null,
            activeTraceState: null
        };
    }
    static emptyStory() {
        const story = {
            clusters: {
                byId: {},
                allIds: []
            },
            edges: {
                byId: {},
                allIds: []
            }
        };
        return story;
    }
    static getActive(stories) {
        return stories.stories[stories.active];
    }
    static retrieveCluster(stories, clusterIndex) {
        return stories.stories[stories.active].clusters.byId[clusterIndex];
    }
    static retreiveEdge(stories, edgeIndex) {
        return stories.stories[stories.active].edges.byId[edgeIndex];
    }
}
exports.StoriesUtil = StoriesUtil;
const initialState = StoriesUtil.createEmpty();
function stories(state = initialState, action) {
    switch (action.type) {
        case SET_VECTORS:
            let clone = Object.assign({}, state);
            clone.vectors = action.vectors;
            return clone;
        case SELECT_SIDE_BRANCH: {
            let sidePaths = state.trace.sidePaths.slice(0);
            sidePaths.splice(action.index, 1);
            sidePaths.push({
                nodes: state.trace.mainPath,
                edges: state.trace.mainEdges,
                syncNodes: []
            });
            let trace = {
                mainPath: state.trace.sidePaths[action.index].nodes,
                mainEdges: state.trace.sidePaths[action.index].edges,
                sidePaths: sidePaths
            };
            trace.sidePaths.forEach(sidePath => {
                sidePath.syncNodes = NumTs_1.getSyncNodesAlt(trace.mainPath, sidePath.nodes);
            });
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: trace,
                activeTraceState: state.activeTraceState
            };
        }
        case SET_ACTIVE_TRACE_STATE: {
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: action.cluster
            };
        }
        case ADD_CLUSTER_TO_TRACE: {
            let cluster = action.cluster;
            // Add cluster to active story book
            const activeStory = StoriesUtil.getActive(state);
            Book_1.ABook.addCluster(activeStory, cluster);
            // Add edge that connects the active trace state with the current cluster
            if (state.trace.mainPath.length > 0) {
                let edge = {
                    source: state.trace.mainPath[state.trace.mainPath.length - 1],
                    destination: cluster,
                    objectType: ObjectType_1.ObjectTypes.Edge
                };
                const handle = Book_1.ABook.addEdge(activeStory, edge);
                state.trace.mainEdges.push(handle);
            }
            // Add cluster to current trace
            state.trace.mainPath.push(cluster);
            Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(activeStory.clusters.byId));
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        }
        case SET_ACTIVE_TRACE: {
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: action.activeTrace,
                activeTraceState: state.activeTraceState
            };
        }
        case SET:
            if (state.active !== null) {
                Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(StoriesUtil.getActive(state).clusters.byId));
            }
            return {
                vectors: state.vectors,
                stories: action.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        case DELETE:
            const newState = state.stories.slice(0);
            newState.splice(newState.indexOf(action.story), 1);
            if (state.active == action.story) {
                Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, []);
                return {
                    vectors: state.vectors,
                    stories: newState,
                    active: null,
                    trace: null,
                    activeTraceState: null
                };
            }
            return {
                vectors: state.vectors,
                stories: newState,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        case ADD_STORY_BOOK: {
            let storyBook = action.story;
            let trace = state.trace;
            let activeTraceState = state.activeTraceState;
            if (storyBook.clusters.allIds.length == 0) {
                trace = {
                    mainEdges: [],
                    mainPath: [],
                    sidePaths: []
                };
                activeTraceState = null;
            }
            Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(storyBook.clusters.byId));
            if (state && state.stories.length > 0) {
                const newState = state.stories.slice(0);
                const i = newState.push(storyBook) - 1;
                return {
                    vectors: state.vectors,
                    stories: newState,
                    active: action.activate ? i : state.active,
                    trace: trace,
                    activeTraceState: activeTraceState
                };
            }
            else {
                return {
                    vectors: state.vectors,
                    stories: [storyBook],
                    active: 0,
                    trace: trace,
                    activeTraceState: activeTraceState
                };
            }
        }
        case SET_ACTIVE_STORY_BOOK: {
            let storyBook = state.stories[action.activeStory];
            let trace = state.trace;
            let activeTraceState = state.activeTraceState;
            if (storyBook && storyBook.clusters.allIds.length == 0) {
                trace = {
                    mainPath: [],
                    mainEdges: [],
                    sidePaths: []
                };
                activeTraceState = null;
            }
            else {
                trace = null;
            }
            if (storyBook && storyBook.clusters) {
                Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, Object.values(storyBook.clusters.byId));
            }
            else {
                Cluster_1.ACluster.deriveVectorLabelsFromClusters(state.vectors, []);
            }
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: action.activeStory,
                trace: trace,
                activeTraceState: activeTraceState
            };
        }
        case DELETE_CLUSTER: {
            const cluster = action.cluster;
            const activeStory = StoriesUtil.getActive(state);
            const handle = Book_1.ABook.deleteCluster(activeStory, cluster);
            const entries = Object.entries(activeStory.edges.byId).filter(([edgeHandle, edge]) => {
                return edge.source === handle || edge.destination === handle;
            });
            for (const [handle, edge] of entries) {
                Book_1.ABook.deleteEdge(activeStory, edge);
            }
            // Remove cluster labels from samples
            // TODO: check if this is ok in a reducer
            cluster.indices.map(i => state.vectors[i]).forEach(sample => {
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.splice(sample.groupLabel.indexOf(cluster.label), 1);
                }
                else {
                    sample.groupLabel = [];
                }
            });
            console.log({
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            });
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        }
        case ADD_EDGE_TO_ACTIVE: {
            const activeStory = StoriesUtil.getActive(state);
            const handle = uuid_1.v4();
            activeStory.edges.byId[handle] = action.edge;
            activeStory.edges.allIds.push(handle);
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        }
        case ADD_CLUSTER_TO_ACTIVE: {
            let cluster = action.cluster;
            const story = StoriesUtil.getActive(state);
            Book_1.ABook.addCluster(story, cluster);
            // Add cluster labels to samples
            // TODO: check if this is ok in a reducer
            cluster.indices.forEach(i => {
                const sample = state.vectors[i];
                if (Array.isArray(sample.groupLabel)) {
                    sample.groupLabel.push(cluster.label);
                }
                else {
                    sample.groupLabel = [cluster.label];
                }
            });
            return {
                vectors: state.vectors,
                stories: state.stories,
                active: state.active,
                trace: state.trace,
                activeTraceState: state.activeTraceState
            };
        }
        case REMOVE_EDGE_FROM_ACTIVE: {
            const activeStory = StoriesUtil.getActive(state);
            const handle = Object.keys(activeStory.edges.byId).find(handle => activeStory.edges.byId[handle] === action.edge);
            delete activeStory.edges.byId[handle];
            activeStory.edges.allIds.splice(activeStory.edges.allIds.indexOf(handle), 1);
            return Object.assign({}, state);
        }
        default:
            return state;
    }
}
exports.default = stories;
