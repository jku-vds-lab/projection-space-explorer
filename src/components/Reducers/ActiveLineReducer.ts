import { ActionTypeLiteral } from "../Actions/Actions"

const activeLine = (state = null, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetActiveLine:
            return action.activeLine
        default:
            return state
    }
}

export default activeLine