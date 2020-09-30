import { ActionTypeLiteral } from "../Actions/Actions"

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

export default stories