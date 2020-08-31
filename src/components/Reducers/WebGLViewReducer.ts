import { ActionTypeLiteral } from "../Actions/Actions"

const webGLView = (state = null, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetWebGLView:
            return action.webGLView
        default:
            return state
    }
}

export default webGLView