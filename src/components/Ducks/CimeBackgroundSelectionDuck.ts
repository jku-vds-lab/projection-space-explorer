const SET = "ducks/cimeBackgroundSelection/SET"

const initialState = null

export default function cimeBackgroundSelection(state = initialState, action) {
    switch (action.type) {
        case SET:
            return action.cimeBackgroundSelection
        default:
            return state
    }
}

export function setCimeBackgroundSelection(cimeBackgroundSelection) {
    console.log('triggring setCimeBackgroundSelection in CimeBackgroundSelectionDuck.ts with coords:', cimeBackgroundSelection)
    return ({
        type: SET,
        cimeBackgroundSelection: cimeBackgroundSelection
    })
}