import Cluster from "../Utility/Data/Cluster"
import { Vect } from "../Utility/Data/Vect"

const SET = "ducks/hoverSettings/SET_HOVER_WINDOW_MODE"

export const setHoverWindowMode = windowMode => ({
    type: SET,
    windowMode: windowMode
})

export enum WindowMode {
    Embedded,
    Extern
}

type HoverSettingsType = {
    windowMode: WindowMode
}

const initialState: HoverSettingsType = {
    windowMode: WindowMode.Embedded
}

const hoverSettings = (state = initialState, action) => {
    switch (action.type) {
        case SET:
            return {
                windowMode: action.windowMode
            }
        default:
            return state
    }
}

export default hoverSettings