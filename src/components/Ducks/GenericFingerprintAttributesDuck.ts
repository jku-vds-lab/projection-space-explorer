const SET = "ducks/genericFingerprintAttributes/SET"

export const setGenericFingerprintAttributes = genericFingerprintAttributes => ({
    type: SET,
    genericFingerprintAttributes: genericFingerprintAttributes
});

const genericFingerprintAttributes = (state = [], action): any[] => {
    switch (action.type) {
        case SET:
            return action.genericFingerprintAttributes
        default:
            return state
    }
}

export default genericFingerprintAttributes