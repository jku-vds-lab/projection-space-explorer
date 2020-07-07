const advancedColoringSelection = (state = new Array(100).fill(true), action) => {
    switch (action.type) {
        case 'SET_ADVANCED_COLORING_SELECTION':
            return action.advancedColoringSelection
        default:
            return state
    }
}

export default advancedColoringSelection