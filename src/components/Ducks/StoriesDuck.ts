const ADD = "ducks/stories/ADD"
const DELETE = "ducks/stories/DELETE"
const SET = "ducks/stories/SET"



export const addStory = story => ({
    type: ADD,
    story: story
});

export const deleteStory = story => ({
    type: DELETE,
    story: story
});

export const setStories = stories => ({
    type: SET,
    stories: stories
})

const stories = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.stories
        case DELETE:
            const newState = state.slice(0)
            newState.splice(newState.indexOf(action.story), 1)
            return newState
        case ADD: {
            if (state && state.length > 0) {
                const newState = state.slice(0)
                newState.push(action.story)
                return newState
            } else {
                return [ action.story ]
            }
        }
        default:
            return state
    }
}



export default stories