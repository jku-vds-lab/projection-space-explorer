import { ActionTypeLiteral } from "../Actions/Actions"

export enum StoryMode {
    Cluster,
    Difference
}

const storyMode = (state = StoryMode.Cluster, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetStoryMode:
            return action.storyMode
        default:
            return state
    }
}

export default storyMode