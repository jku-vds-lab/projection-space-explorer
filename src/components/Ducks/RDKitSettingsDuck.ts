/**
 * Duck file for the RDKit Settings
 */


const SET_CONTOURLINES = "ducks/rdkitsettings/SET_CONTOURLINES"
const SET_SCALE = "ducks/rdkitsettings/SET_SCALE"
const SET_SIGMA = "ducks/rdkitsettings/SET_SIGMA"
const SET_REFRESH = "ducks/rdkitsettings/SET_REFRESH"
const SET_SHOW_MCS = "ducks/rdkitsettings/SET_SHOW_MCS"
const SET_WIDTH = "ducks/rdkitsettings/SET_WIDTH"

export const setRDKit_contourLines = input => ({
    type: SET_CONTOURLINES,
    input: input
});

export const setRDKit_scale = input => ({
    type: SET_SCALE,
    input: input
});

export const setRDKit_sigma = input => ({
    type: SET_SIGMA,
    input: input
});

export const setRDKit_refresh = input => ({
    type: SET_REFRESH,
    input: input
});

export const setRDKit_showMCS = input => ({
    type: SET_SHOW_MCS,
    input: input
});

export const setRDKit_width = input => ({
    type: SET_WIDTH,
    input: input
});


const initialState: RDKitSettingsType = {
    contourLines: 10,
    scale: -1,
    sigma: 0,
    refresh: 0,
    showMCS: true,
    width: 250
}
export type RDKitSettingsType = {
    contourLines: number
    scale: number
    sigma: number
    refresh: number
    showMCS: boolean
    width: number
}

const rdkitSettings = (state = initialState, action): RDKitSettingsType => {
    switch (action.type) {
        case SET_CONTOURLINES:
            return {...state, contourLines: action.input}
        case SET_SCALE:
            return {...state, scale: action.input}
        case SET_SIGMA:
            return {...state, sigma: action.input}
        case SET_REFRESH:
            return {...state, refresh: action.input}
        case SET_SHOW_MCS:
            return {...state, showMCS: action.input}
        case SET_WIDTH:
            return {...state, width: action.input}
        default:
            return state
    }
}



export default rdkitSettings