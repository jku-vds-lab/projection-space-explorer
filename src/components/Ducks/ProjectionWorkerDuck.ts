const SET = "ducks/projectionWorker/SET"

export const setProjectionWorkerAction = projectionWorker => ({
    type: SET,
    projectionWorker: projectionWorker
});

const projectionWorker = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.projectionWorker
        default:
            return state
    }
}

export default projectionWorker