

const currentTool = (state = 'default', action) => {
    switch (action.type) {
        case 'SET_TOOL':
            return action.tool
        default:
            return state
    }
}

export default currentTool