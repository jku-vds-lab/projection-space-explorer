const SET = "reducers/DISPLAY_MODE"

export enum DisplayMode {
    OnlyStates,
    OnlyClusters,
    StatesAndClusters
}

export default function displayMode (state = DisplayMode.StatesAndClusters, action): DisplayMode  {
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