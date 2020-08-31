import { ActionTypeLiteral } from "../Actions/Actions"

const advancedColoringSelection = (state = new Array(100).fill(true), action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetAdvancedColoringSelection:
            return action.advancedColoringSelection
        default:
            return state
    }
}

export default advancedColoringSelection