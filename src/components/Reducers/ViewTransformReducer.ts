import { ActionTypeLiteral } from "../Actions/Actions"

export const viewTransform = (state = null, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetViewTransform:
            return action.viewTransform
        default:
            return state
    }
}