import { ActionTypeLiteral } from "../Actions/Actions"

const projectionOpen = (state = false, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetProjectionOpen:
            return action.projectionOpen
        default:
            return state
    }
}

export default projectionOpen