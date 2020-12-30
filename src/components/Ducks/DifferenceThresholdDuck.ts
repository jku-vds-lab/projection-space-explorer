const SET = "differenceThreshold/SET"

export const differenceThreshold = (state = 0.25, action) => {
    switch (action.type) {
        case SET:
            return action.differenceThreshold
        default:
            return state
    }
}

export const setDifferenceThreshold = (differenceThreshold) => ({
    type: SET,
    differenceThreshold: differenceThreshold
})

const SET2 = "oldDifferenceThreshold/SET"

export const oldDifferenceThreshold = (state = 0.25, action) => {
    switch (action.type) {
        case SET2:
            return action.oldDifferenceThreshold
        default:
            return state
    }
}

export const setOldDifferenceThreshold = (oldDifferenceThreshold) => ({
    type: SET2,
    oldDifferenceThreshold: oldDifferenceThreshold
})

export default differenceThreshold