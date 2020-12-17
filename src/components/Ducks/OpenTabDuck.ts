const SET = "ducks/openTab/SET"

export const setOpenTabAction = openTab => ({
    type: SET,
    openTab: openTab
});

const openTab = (state = 0, action) => {

    switch (action.type) {
        case SET:
            return action.openTab
        default:
            return state
    }
}

export default openTab