const SET = "ducks/webGLView/SET"

export const setWebGLView = webGLView => ({
    type: SET,
    webGLView: webGLView
});

const initialState: React.Component = null

export default function webGLView (state = initialState, action): React.Component {
    switch (action.type) {
        case SET:
            return action.webGLView
        default:
            return state
    }
}