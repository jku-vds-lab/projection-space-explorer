import { ActionTypeLiteral } from "../Actions/Actions"

const projectionWorker = (state = null, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetProjectionWorker:
            return action.projectionWorker
        default:
            return state
    }
}

export default projectionWorker