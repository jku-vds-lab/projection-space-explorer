const SET = "ducks/projectionParams/SET"

export const setProjectionParamsAction = projectionParams => ({
    type: SET,
    projectionParams: projectionParams
});

const projectionParams = (state = {

}, action) => {
    switch (action.type) {
        case SET:
            return action.projectionParams
        default:
            return state
    }
}

export default projectionParams