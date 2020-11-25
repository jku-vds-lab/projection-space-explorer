/**
 * Duck file for the LineUp input data
 */

import { Vect } from "../Utility/Data/Vect";

const SET = "ducks/lineUpInput/SET"

export const setLineUpInput = input => ({
    type: SET,
    input: input
});

const initialState: LineUpType = {
    data: null,
    columns: null
}
export type LineUpType = {
    data: Vect[],
    columns: []
}

const lineUpInput = (state = initialState, action): LineUpType => {
    switch (action.type) {
        case SET:
            return action.input
        default:
            return state
    }
}



export default lineUpInput