import { ActionTypeLiteral } from "../Actions/Actions"

const stories = (state = [], action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetStories:
            return action.stories
        default:
            return state
    }
}

export default stories