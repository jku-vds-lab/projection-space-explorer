"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoriesDuck_1 = require("./StoriesDuck");
const THUNK_SET_VECTORS = "ducks/THUNK_SET";
const THUNK_SET_CLUSTERS = "ducks/THUNK_SET_CLUSTERS";
exports.selectVectors = (selection, shiftKey = false) => {
    return (dispatch, getState) => {
        var _a;
        const state = getState();
        const clusters = (_a = StoriesDuck_1.StoriesUtil.getActive(state.stories)) === null || _a === void 0 ? void 0 : _a.clusters.byId;
        let newSelection = [];
        if (shiftKey) {
            const selectionSet = new Set(state.currentAggregation.aggregation);
            selection.forEach(index => {
                if (selectionSet.has(index)) {
                    selectionSet.delete(index);
                }
                else {
                    selectionSet.add(index);
                }
            });
            newSelection = [...selectionSet];
        }
        else {
            newSelection = [...selection];
        }
        return dispatch({
            type: THUNK_SET_VECTORS,
            clusterSelection: deriveFromSamples(newSelection.map(i => state.dataset.vectors[i]), clusters),
            vectorSelection: newSelection
        });
    };
};
exports.selectClusters = (selection, shiftKey = false) => {
    return (dispatch, getState) => {
        const state = getState();
        const vectors = state.dataset.vectors;
        let newSelection = [];
        if (shiftKey) {
            const selectionSet = new Set(state.currentAggregation.selectedClusters);
            selection.forEach(index => {
                if (selectionSet.has(index)) {
                    selectionSet.delete(index);
                }
                else {
                    selectionSet.add(index);
                }
            });
            newSelection = [...selectionSet];
        }
        else {
            newSelection = [...selection];
        }
        return dispatch({
            type: THUNK_SET_CLUSTERS,
            clusterSelection: newSelection,
            vectorSelection: deriveFromClusters(newSelection.map(i => StoriesDuck_1.StoriesUtil.getActive(state.stories).clusters.byId[i]))
        });
    };
};
function deriveFromClusters(clusters) {
    let agg = clusters.map(cluster => cluster.indices).flat();
    return [...new Set(agg)];
}
function deriveFromSamples(samples, clusters) {
    if (!clusters) {
        return [];
    }
    let labels = new Set();
    samples.forEach(sample => {
        sample.groupLabel.forEach(label => {
            labels.add(label);
        });
    });
    let arr = Array.from(labels);
    const result = [];
    for (const [key, cluster] of Object.entries(clusters)) {
        if (arr.includes(cluster.label)) {
            result.push(key);
        }
    }
    return result;
}
const initialState = {
    aggregation: [],
    selectedClusters: [],
    source: 'sample'
};
const currentAggregation = (state = initialState, action) => {
    switch (action.type) {
        case THUNK_SET_VECTORS: {
            return {
                aggregation: action.vectorSelection,
                selectedClusters: action.clusterSelection,
                source: 'sample'
            };
        }
        case THUNK_SET_CLUSTERS: {
            return {
                aggregation: action.vectorSelection,
                selectedClusters: action.clusterSelection,
                source: 'cluster'
            };
        }
        default:
            return state;
    }
};
exports.default = currentAggregation;
