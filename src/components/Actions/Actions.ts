import advancedColoringSelection from "../Reducers/AdvancedColoringSelection"

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

export const setViewTransformAction = viewTransform => ({
    type: 'SET_VIEW_TRANSFORM',
    viewTransform: viewTransform
})

export const setAdvancedColoringSelectionAction = advancedColoringSelection => ({
    type: 'SET_ADVANCED_COLORING_SELECTION',
    advancedColoringSelection: advancedColoringSelection
})

export const setActiveStoryAction = activeStory => ({
    type: 'SET_ACTIVE_STORY',
    activeStory: activeStory
})

export const setStoriesAction = stories => ({
    type: 'SET_STORIES',
    stories: stories
})

export const setDatasetAction = dataset => ({
    type: 'SET_DATASET',
    dataset: dataset
})

export const setOpenTabAction = openTab => ({
    type: 'SET_OPEN_TAB',
    openTab: openTab
})

export const setStoryModeAction = storyMode => ({
    type: 'SET_STORY_MODE',
    storyMode: storyMode
})

export const setProjectionColumns = projectionColumns => ({
    type: 'SET_PROJECTION_COLUMNS',
    projectionColumns: projectionColumns
})

export const setProjectionColumnsEntry = (index, value) => ({
    type: 'SET_PROJECTION_COLUMNS_ENTRY',
    index: index,
    value: value
})

export const setProjectionColumnsShift = (last, index) => ({
    type: 'SET_PROJECTION_COLUMNS_SHIFT',
    last: last,
    index: index
})