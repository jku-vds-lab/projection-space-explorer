const SET = "ducks/pointColorScale/SET"

export const setPointColorScale = pointColorScale => ({
    type: SET,
    pointColorScale: pointColorScale
});


const pointColorScale = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.pointColorScale
        default:
            return state
    }
}

export default pointColorScale