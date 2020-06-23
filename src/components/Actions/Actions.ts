export const setVectorByShapeAction = vectorByShape => ({
    type: 'SET_VECTOR_BY_SHAPE',
    vectorByShape: vectorByShape
})

export const setCheckedShapesAction = checkedShapes => ({
    type: 'SET_CHECKED_SHAPES',
    checkedShapes: checkedShapes
})

export const setSelectedVectorByShapeAction = selectedVectorByShape => ({
    type: 'SET_SELECTED_VECTOR_BY_SHAPE',
    selectedVectorByShape: selectedVectorByShape
})

export const setAggregationAction = id => ({
    type: 'SET_AGGREGATION',
    aggregation: id
})

export const setClusterEdgesAction = clusterEdges => ({
    type: 'SET_CLUSTER_EDGES',
    clusterEdges: clusterEdges
})


export const setActiveLineAction = activeLine => ({
    type: 'SET_ACTIVE_LINE',
    activeLine: activeLine
})

export const setHighlightedSequenceAction = highlightedSequence => ({
    type: 'SET_HIGHLIGHTED_SEQUENCE',
    highlightedSequence: highlightedSequence
})