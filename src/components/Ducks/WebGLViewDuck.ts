const SET = "ducks/webGLView/SET"

export const setWebGLView = webGLView => ({
    type: SET,
    webGLView: webGLView
});

const webGLView = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.webGLView
        default:
            return state
    }
}

export default webGLView