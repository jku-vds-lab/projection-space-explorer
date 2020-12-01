/**
 * Duck file for the LineUp input data
 */

import { Vect } from "../Utility/Data/Vect";

const SET_DATA = "ducks/lineUpInput/SET_DATA"
const SET_COLUMNS = "ducks/lineUpInput/SET_COLUMNS"
const SET_VISIBILITY = "ducks/lineUpInput/SET_VISIBILITY"

export const setLineUpInput_data = input => ({
    type: SET_DATA,
    input: input
});

export const setLineUpInput_columns = input => ({
    type: SET_COLUMNS,
    input: input
});

export const setLineUpInput_visibility = input => ({
    type: SET_VISIBILITY,
    input: input
});

const initialState: LineUpType = {
    data: null,
    columns: null,
    show: false
}
export type LineUpType = {
    data: Vect[],
    columns: [],
    show: boolean
}

const lineUpInput = (state = initialState, action): LineUpType => {
    switch (action.type) {
        case SET_DATA:
            return {...state, data: action.input}
        case SET_COLUMNS:
            return {...state, columns: action.input}
        case SET_VISIBILITY:
            return {...state, show: action.input}
        default:
            return state
    }
}



export default lineUpInput