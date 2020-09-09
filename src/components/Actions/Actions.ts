import advancedColoringSelection from "../Reducers/AdvancedColoringSelection"



export enum ActionTypeLiteral {
    SetVectorByShape = 'SET_VECTOR_BY_SHAPE',
    SetCheckedShapes = 'SET_CHECKED_SHAPES',
    SetSelectedVectorByShape = 'SET_SELECTED_VECTOR_BY_SHAPE',
    SetAggregation = 'SET_AGGREGATION',
    ToggleAggregation = 'TOGGLE_AGGREGATION',
    SetClusterEdges = 'SET_CLUSTER_EDGES',
    SetActiveLine = 'SET_ACTIVE_LINE',
    SetHighlightedSequence = 'SET_HIGHLIGHTED_SEQUENCE',
    SetViewTransform = 'SET_VIEW_TRANSFORM',
    SetAdvancedColoringSelection = 'SET_ADVANCED_COLORING_SELECTION',
    SetActiveStory = 'SET_ACTIVE_STORY',
    SetStories = 'SET_STORIES',
    SetDataset = 'SET_DATASET',
    SetOpenTab = 'SET_OPEN_TAB',
    SetStoryMode = 'SET_STORY_MODE',
    SetProjectionColumns = 'SET_PROJECTION_COLUMNS',
    SetProjectionColumnsEntry = 'SET_PROJECTION_COLUMNS_ENTRY',
    SetProjectionColumnsShift = 'SET_PROJECTION_COLUMNS_SHIFT',
    SetCurrentClusters = 'SET_CURRENT_CLUSTERS',
    SetProjectionOpen = 'SET_PROJECTION_OPEN',
    SetProjectionParams = 'SET_PROJECTION_PARAMS',
    SetProjectionWorker = 'SET_PROJECTION_WORKER',
    SetWebGLView = 'SET_WEB_GL_VIEW',
    SetClusterMode = 'SET_CLUSTER_MODE',
    SetSelectedClusters = 'SET_SELECTED_CLUSTERS',
    ToggleSelectedCluster = 'TOGGLE_SELECTED_CLUSTER'

}

export const toggleAggregationAction = aggregation => ({
    type: ActionTypeLiteral.ToggleAggregation,
    aggregation: aggregation
})

export const toggleSelectedClusterAction = selectedCluster => ({
    type: ActionTypeLiteral.ToggleSelectedCluster,
    selectedCluster: selectedCluster
})

export const setSelectedClustersAction = selectedClusters => ({
    type: ActionTypeLiteral.SetSelectedClusters,
    selectedClusters: selectedClusters
})

export const setClusterModeAction = clusterMode => ({
    type: ActionTypeLiteral.SetClusterMode,
    clusterMode: clusterMode
})

export const setWebGLViewAction = webGLView => ({
    type: ActionTypeLiteral.SetWebGLView,
    webGLView: webGLView
})

export const setProjectionWorkerAction = projectionWorker => ({
    type: ActionTypeLiteral.SetProjectionWorker,
    projectionWorker: projectionWorker
})

export const setProjectionParamsAction = projectionParams => ({
    type: ActionTypeLiteral.SetProjectionParams,
    projectionParams: projectionParams
})

export const setProjectionOpenAction = projectionOpen => ({
    type: ActionTypeLiteral.SetProjectionOpen,
    projectionOpen: projectionOpen
})

export const setCurrentClustersAction = currentClusters => ({
    type: ActionTypeLiteral.SetCurrentClusters,
    currentClusters: currentClusters
})

export const setVectorByShapeAction = vectorByShape => ({
    type: ActionTypeLiteral.SetVectorByShape,
    vectorByShape: vectorByShape
})

export const setCheckedShapesAction = checkedShapes => ({
    type: ActionTypeLiteral.SetCheckedShapes,
    checkedShapes: checkedShapes
})

export const setSelectedVectorByShapeAction = selectedVectorByShape => ({
    type: ActionTypeLiteral.SetSelectedVectorByShape,
    selectedVectorByShape: selectedVectorByShape
})

export const setAggregationAction = id => ({
    type: ActionTypeLiteral.SetAggregation,
    aggregation: id
})

export const setClusterEdgesAction = clusterEdges => ({
    type: ActionTypeLiteral.SetClusterEdges,
    clusterEdges: clusterEdges
})


export const setActiveLineAction = activeLine => ({
    type: ActionTypeLiteral.SetActiveLine,
    activeLine: activeLine
})

export const setHighlightedSequenceAction = highlightedSequence => ({
    type: ActionTypeLiteral.SetHighlightedSequence,
    highlightedSequence: highlightedSequence
})

export const setViewTransformAction = viewTransform => ({
    type: ActionTypeLiteral.SetViewTransform,
    viewTransform: viewTransform
})

export const setAdvancedColoringSelectionAction = advancedColoringSelection => ({
    type: ActionTypeLiteral.SetAdvancedColoringSelection,
    advancedColoringSelection: advancedColoringSelection
})

export const setActiveStoryAction = activeStory => ({
    type: ActionTypeLiteral.SetActiveStory,
    activeStory: activeStory
})

export const setStoriesAction = stories => ({
    type: ActionTypeLiteral.SetStories,
    stories: stories
})

export const setDatasetAction = dataset => ({
    type: ActionTypeLiteral.SetDataset,
    dataset: dataset
})

export const setOpenTabAction = openTab => ({
    type: ActionTypeLiteral.SetOpenTab,
    openTab: openTab
})

export const setStoryModeAction = storyMode => ({
    type: ActionTypeLiteral.SetStoryMode,
    storyMode: storyMode
})

export const setProjectionColumns = projectionColumns => ({
    type: ActionTypeLiteral.SetProjectionColumns,
    projectionColumns: projectionColumns
})

export const setProjectionColumnsEntry = (index, value) => ({
    type: ActionTypeLiteral.SetProjectionColumnsEntry,
    index: index,
    value: value
})

export const setProjectionColumnsShift = (last, index) => ({
    type: ActionTypeLiteral.SetProjectionColumnsShift,
    last: last,
    index: index
})