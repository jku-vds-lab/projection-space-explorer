const SET = "ducks/activeStory/SET"

const activeStory = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.activeStory
        default:
            return state
    }
}

export const setActiveStory = activeStory => ({
    type: SET,
    activeStory: activeStory
})

export default activeStory