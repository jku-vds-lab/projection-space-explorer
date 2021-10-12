export enum NormalizationMethod{
    STANDARDIZE, // values are mapped to have 0 mean and unit standard deviation
    NORMALIZE01 // values are mapped between [0;1]
}

export enum EncodingMethod{ // for categorical features
    ONEHOT,
    NUMERIC
}

export enum DistanceMetric{
    EUCLIDEAN,
    JACCARD,
    GOWER,
    COSINE,
    MANHATTAN
}


const SET = "ducks/projectionParams/SET"

export const setProjectionParamsAction = projectionParams => ({
    type: SET,
    projectionParams: projectionParams
});

const initialState = {
    perplexity: 50,
    learningRate: 50,
    nNeighbors: 15,
    iterations: 1000,
    seeded: false,
    useSelection: false,
    method: '',
    distanceMetric: DistanceMetric.EUCLIDEAN,
    normalizationMethod: NormalizationMethod.STANDARDIZE,
    encodingMethod: EncodingMethod.ONEHOT
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