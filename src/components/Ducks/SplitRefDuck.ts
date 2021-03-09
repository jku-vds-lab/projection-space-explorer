const SET = "ducks/splitRef/SET"

export const setSplitRef = splitRef => ({
    type: SET,
    splitRef: splitRef
});

const initialState: React.RefObject<any> = null

export default function splitRef (state = initialState, action): React.RefObject<any> {
    switch (action.type) {
        case SET:
            return action.splitRef
        default:
            return state
    }
}