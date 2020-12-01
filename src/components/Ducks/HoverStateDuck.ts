import Cluster from "../Utility/Data/Cluster";
import { Vect } from "../Utility/Data/Vect";

const SET = "ducks/hoverState/SET"

export const setHoverState = hoverState => ({
    type: SET,
    hoverState: hoverState
});

type HoverStateType = Vect | Cluster

const hoverState = (state = [], action) => {
    switch (action.type) {
        case SET:
            return action.hoverState
        default:
            return state
    }
}

export default hoverState