const highlightedSequence = (state = null, action) => {
    switch (action.type) {
        case 'SET_HIGHLIGHTED_SEQUENCE':
            return action.highlightedSequence
        default:
            return state
    }
}

export default highlightedSequence