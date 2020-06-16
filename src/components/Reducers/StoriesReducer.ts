const stories = (state = [], action) => {
    switch (action.type) {
        case 'SET_STORIES':
            return action.stories
        default:
            return state
    }
}

export default stories