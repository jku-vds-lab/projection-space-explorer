import { ICluster } from "../Utility/Data/Cluster";
import { IVect } from "../Utility/Data/Vect";

const SET = "ducks/hoverState/SET"

export const setHoverState = (hoverState, updater) => ({
    type: SET,
    input: {data: hoverState, updater: updater}
});


const initialState: HoverStateType = {
    data: null,
    updater: ""
}

export type HoverStateType = {
    data: IVect | ICluster,
    updater: String
}


const hoverState = (state = initialState, action): HoverStateType => {
    switch (action.type) {
        case SET:
            return {...state, data: action.input?.data, updater: action.input?.updater}
        default:
            return state
    }
}

export default hoverState

