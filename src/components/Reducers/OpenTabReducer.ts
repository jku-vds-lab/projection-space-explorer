const openTab = (state = 0, action) => {
    switch (action.type) {
        case 'SET_OPEN_TAB':
            return action.openTab
        default:
            return state
    }
}

export default openTab