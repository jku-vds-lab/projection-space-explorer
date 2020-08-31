import { ActionTypeLiteral } from "../Actions/Actions"

const projectionParams = (state = {
    
}, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetProjectionParams:
            return action.projectionParams
        default:
            return state
    }
}

export default projectionParams