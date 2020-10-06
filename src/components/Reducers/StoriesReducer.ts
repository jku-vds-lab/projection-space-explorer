import { ActionTypeLiteral } from "../Actions/Actions"

const SET = "components/stories/SET"
const ADD = "components/stories/ADD"
const DELETE = "components/stories/DELETE"

const stories = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetStories:
            return action.stories
        case ActionTypeLiteral.DeleteStory:
            const newState = state.slice(0)
            newState.splice(newState.indexOf(action.story), 1)
            return newState
        case ActionTypeLiteral.AddStory: {
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

export const setStories = stories => ({
    type: SET,
    stores: stories
})

export const addStory = story => ({
    type: ADDRCONFIG,
    story: story
})

export const deleteStory = story => ({
    type: DELETE,
    story: story
})

export default stories