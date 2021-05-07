const SET = "ducks/projectionParams/SET"

export const setProjectionParamsAction = projectionParams => ({
    type: SET,
    projectionParams: projectionParams
});

const initialState = {
    perplexity: 50,
    learningRate: 50,
    nNeighbors: 15,
    iterations: 500, // 1000, //TODO: for benchmark; revert to 1000 afterwards
    seeded: false,
    useSelection: false,
    method: '',
    distanceMetric: 'euclidean'
}

type ProjectionParamsState = typeof initialState

const projectionParams = (state = initialState, action): ProjectionParamsState => {
    switch (action.type) {
        case SET:
            return action.projectionParams
        default:
            return state
    }
}

export default projectionParams