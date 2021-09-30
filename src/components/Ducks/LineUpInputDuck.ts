/**
 * Duck file for the LineUp input data
 */

import { filter } from "lodash";
import { IVector } from "../../model/Vector";

// const SET_DATA = "ducks/lineUpInput/SET_DATA"
// const SET_COLUMNS = "ducks/lineUpInput/SET_COLUMNS"
const SET_VISIBILITY = "ducks/lineUpInput/SET_VISIBILITY"
const SET_DUMP = "ducks/lineUpInput/SET_DUMP"
const SET_FILTER = "ducks/lineUpInput/SET_FILTER"
const UPDATE_FILTER = "ducks/lineUpInput/UPDATE_FILTER"
const SET_LINEUP = "ducks/lineUpInput/SET_LINEUP"
const SET_UPDATE = "ducks/lineUpInput/SET_UPDATE"

// export const setLineUpInput_data = input => ({
//     type: SET_DATA,
//     input: input
// });

// export const setLineUpInput_columns = input => ({
//     type: SET_COLUMNS,
//     input: input
// });

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

export const updateLineUpInput_filter = input => ({
    type: UPDATE_FILTER,
    input: input
});

export const setLineUpInput_lineup = input => ({
    type: SET_LINEUP,
    input: input
});

export const setLineUpInput_update = input => ({
    type: SET_UPDATE,
    input: input
});

const initialState: LineUpType = {
    // data: null,
    // columns: null,
    show: false,
    dump: "",
    filter: null,
    previousfilter: null,
    lineup: null,
    update: 0,
}
export type LineUpType = {
    // data: Vect[],
    // columns: [],
    show: boolean,
    dump: string,
    filter: object,
    previousfilter: object,
    lineup: any,
    update: number,
}

const lineUpInput = (state = initialState, action): LineUpType => {
    switch (action.type) {
        // case SET_DATA:
        //     return {...state, data: action.input}
        // case SET_COLUMNS:
        //     return {...state, columns: action.input}
        case SET_VISIBILITY:
            return {...state, show: action.input}
        case SET_DUMP:
            return {...state, dump: action.input}
        case SET_FILTER:
            const prev_filter = {...state.filter};
            return {...state, previousfilter: prev_filter, filter: action.input}
        case UPDATE_FILTER:
            if(state.filter && Object.keys(state.filter).includes(action.input["key"])){
                if(state.filter[action.input["key"]] == action.input["val_old"]){
                    const filter_new = {...filter}
                    filter_new[action.input["key"]] = action.input["val_new"]
                    return {...state, filter: filter_new};
                }
            }
            return state;
        case SET_LINEUP:
            return {...state, lineup: action.input}
        case SET_UPDATE:
            const cur = state.update;
            return {...state, update: cur+1}
        default:
            return state
    }
}



export default lineUpInput