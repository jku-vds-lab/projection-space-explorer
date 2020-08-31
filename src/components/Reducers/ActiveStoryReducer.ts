import { ActionTypeLiteral } from "../Actions/Actions"

const activeStory = (state = null, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetActiveStory:
            return action.activeStory
        default:
            return state
    }
}

export default activeStory