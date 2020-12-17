const SET = "ducks/pointColorMapping/SET"

export const setPointColorMapping = pointColorMapping => ({
    type: SET,
    pointColorMapping: pointColorMapping
});


const pointColorMapping = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.pointColorMapping
        default:
            return state
    }
}

export default pointColorMapping