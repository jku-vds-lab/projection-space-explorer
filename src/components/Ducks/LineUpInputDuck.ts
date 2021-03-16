/**
 * Duck file for the LineUp input data
 */

import { Vect } from "../Utility/Data/Vect";

const SET_DATA = "ducks/lineUpInput/SET_DATA"
const SET_COLUMNS = "ducks/lineUpInput/SET_COLUMNS"
const SET_VISIBILITY = "ducks/lineUpInput/SET_VISIBILITY"
const SET_DUMP = "ducks/lineUpInput/SET_DUMP"
const SET_FILTER = "ducks/lineUpInput/SET_FILTER"
const SET_LINEUP = "ducks/lineUpInput/SET_LINEUP"

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

export const setLineUpInput_dump = input => ({
    type: SET_DUMP,
    input: input
});

export const setLineUpInput_filter = input => ({
    type: SET_FILTER,
    input: input
});

export const setLineUpInput_lineup = input => ({
    type: SET_LINEUP,
    input: input
});

const initialState: LineUpType = {
    data: null,
    columns: null,
    show: false,
    dump: "",
    filter: null,
    lineup: null
}
export type LineUpType = {
    data: Vect[],
    columns: [],
    show: boolean,
    dump: string,
    filter: object,
    lineup: any
}

const lineUpInput = (state = initialState, action): LineUpType => {
    switch (action.type) {
        case SET_DATA:
            return {...state, data: action.input}
        case SET_COLUMNS:
            return {...state, columns: action.input}
        case SET_VISIBILITY:
            return {...state, show: action.input}
        case SET_DUMP:
            return {...state, dump: action.input}
        case SET_FILTER:
            return {...state, filter: action.input}
        case SET_LINEUP:
            return {...state, lineup: action.input}
        default:
            return state
    }
}



export default lineUpInput