const OPEN = "ducks/storyEditor/OPEN"

export const openStoryEditor = (visible: boolean) => ({
    type: OPEN,
    visible: visible
})

const initialState = {
    visible: false
}

const storyEditor = (state = initialState, action) => {
    switch (action.type) {
        case OPEN:
            return { visible: action.visible }
        default:
            return state
    }
}

export default storyEditor