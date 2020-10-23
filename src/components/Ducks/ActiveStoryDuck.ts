import { Story } from "../util/Cluster"

const SET = "ducks/activeStory/SET"

const initialState: Story = null

export default function activeStory (state = initialState, action): Story {
    switch (action.type) {
        case SET:
            return action.activeStory
        default:
            return state
    }
}

export const setActiveStory = activeStory => ({
    type: SET,
    activeStory: activeStory
})