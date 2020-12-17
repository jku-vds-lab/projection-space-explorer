const SET = "ducks/storyMode/SET"

export enum StoryMode {
    Cluster,
    Difference
}

const storyMode = (state = StoryMode.Cluster, action) => {
    switch (action.type) {
        case SET:
            return action.storyMode
        default:
            return state
    }
}

export default storyMode

export const setStoryMode = storyMode => ({
    type: SET,
    storyMode: storyMode
});
