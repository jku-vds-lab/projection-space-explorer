export const vectorByColor = (state = null, action) => {
    switch (action.type) {
        case 'SET_VECTOR_BY_COLOR':
            return action.vectorByColor
        default:
            return state
    }
}

export const selectedVectorByColor = (state = "", action) => {
    switch (action.type) {
        case 'SET_SELECTED_VECTOR_BY_COLOR':
            return action.selectedVectorByColor
        default:
            return state
    }
}


export const checkedShapes = (state = { 'star': true, 'cross': true, 'circle': true, 'square': true }, action) => {
    switch (action.type) {
        case 'SET_CHECKED_SHAPES':
            return action.checkedShapes
        default:
            return state
    }
}


export const vectorByShape = (state = null, action) => {
    switch (action.type) {
        case 'SET_VECTOR_BY_SHAPE':
            return action.vectorByShape
        default:
            return state
    }
}

export const selectedVectorByShape = (state = "", action) => {
    switch (action.type) {
        case 'SET_SELECTED_VECTOR_BY_SHAPE':
            return action.selectedVectorByShape
        default:
            return state
    }
}