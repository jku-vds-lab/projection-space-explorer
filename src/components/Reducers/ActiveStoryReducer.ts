const activeStory = (state = null, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_STORY':
            return action.activeStory
        default:
            return state
    }
}

export default activeStory