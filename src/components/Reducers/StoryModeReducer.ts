export enum StoryMode {
    Cluster,
    Difference
}

const storyMode = (state = StoryMode.Cluster, action) => {
    switch (action.type) {
        case 'SET_STORY_MODE':
            return action.storyMode
        default:
            return state
    }
}

export default storyMode