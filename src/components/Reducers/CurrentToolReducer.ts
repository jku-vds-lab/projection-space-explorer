import { Tool } from "../ToolSelection/ToolSelection"


const currentTool = (state = Tool.Default, action) => {
    switch (action.type) {
        case 'SET_TOOL':
            return action.tool
        default:
            return state
    }
}

export default currentTool