const selectedLines = (state = {}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_LINES':
            return action.selectedLines
        default:
            return state
    }
}

export default selectedLines