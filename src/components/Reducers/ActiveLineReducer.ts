const activeLine = (state = null, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_LINE':
            return action.activeLine
        default:
            return state
    }
}

export default activeLine