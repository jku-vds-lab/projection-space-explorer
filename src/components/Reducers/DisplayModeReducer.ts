const SET = "reducers/DISPLAY_MODE"

export enum DisplayMode {
    OnlyStates,
    OnlyClusters,
    StatesAndClusters
}

const displayMode = (state = DisplayMode.StatesAndClusters, action) => {
    switch (action.type) {
        case SET:
            return action.displayMode
        default:
            return state
    }
}

export const setDisplayMode = (displayMode) => {
    return {
        type: SET,
        displayMode: displayMode
    }
}

export default displayMode