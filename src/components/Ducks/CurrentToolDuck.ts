import { Tool } from "../Overlays/ToolSelection/ToolSelection"
const SET = "ducks/currentTool/SET"

export const setCurrentTool = currentTool => ({
    type: SET,
    currentTool: currentTool
})

const currentTool = (state = Tool.Default, action) => {
    switch (action.type) {
        case SET:
            return action.currentTool
        default:
            return state
    }
}

export default currentTool