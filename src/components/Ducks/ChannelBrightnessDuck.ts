const SET_SELECTION = "ducks/channelBrightness/SET_SELECTION"
const SET_OPTIONS = "ducks/channelBrightness/SET_OPTIONS"

const channelBrightness = (state = "", action) => {
    switch (action.type) {
        case SET_SELECTION:
            return action.selection;
        case SET_OPTIONS:
            return action.selection
        default:
            return state;
    }
};

export const setChannelBrightnessSelection = selection => ({
    type: SET_SELECTION,
    selection: selection
})

export const setChannelBrightnessOptions = options => ({
    type: SET_OPTIONS,
    options: options
})

export default channelBrightness