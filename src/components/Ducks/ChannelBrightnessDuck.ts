const SET_SELECTION = "ducks/channelBrightness/SET_SELECTION"

const channelBrightness = (state = null, action) => {
    switch (action.type) {
        case SET_SELECTION:
            return action.selection;
        default:
            return state;
    }
};

export const setChannelBrightnessSelection = selection => ({
    type: SET_SELECTION,
    selection: selection
})

export default channelBrightness