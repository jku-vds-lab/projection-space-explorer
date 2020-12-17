const SET = "ducks/webGLView/SET"

export const setWebGLView = webGLView => ({
    type: SET,
    webGLView: webGLView
});

const initialState: React.RefObject<any> = null

export default function webGLView (state = initialState, action): React.RefObject<any> {
    switch (action.type) {
        case SET:
            return action.webGLView
        default:
            return state
    }
}