const SET_LENGTH = "ducks/trailSettings/SET_LENGTH"
const SET_VISIBILITY = "ducks/trailSettings/SET_VISIBILITY"

type TrailSettingsState = {
    length: number
    show: boolean
}

const initialState: TrailSettingsState = {
    length: 50,
    show: true
}

export default function trailSettings (state = initialState, action) {
    switch (action.type) {
        case SET_LENGTH:
            return {
                show: state.show,
                length: action.length
            }
        case SET_VISIBILITY:
            return {
                show: action.show,
                length: state.length
            }
        default:
            return state;
    }
};

export function setTrailLength(length: number) {
    return {
        type: SET_LENGTH,
        length: length
    }
}

export function setTrailVisibility(show: boolean) {
    return {
        type: SET_VISIBILITY,
        show: show
    }
}