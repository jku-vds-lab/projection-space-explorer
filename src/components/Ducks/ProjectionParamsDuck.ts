import { NormalizationMethod } from "../../model/NormalizationMethod";
import { DistanceMetric } from "../../model/DistanceMetric";
import { EncodingMethod } from "../../model/EncodingMethod";

const SET = "ducks/projectionParams/SET"




export const setProjectionParamsAction = projectionParams => ({
    type: SET,
    projectionParams: projectionParams
});

const initialState = {
    perplexity: 30, //50,
    learningRate: 1.0,//50,
    nNeighbors: 15,
    iterations: 500, //1000,
    seeded: false,
    useSelection: false,
    method: '',
    distanceMetric: DistanceMetric.EUCLIDEAN,
    normalizationMethod: NormalizationMethod.STANDARDIZE,
    encodingMethod: EncodingMethod.ONEHOT
}

export type ProjectionParamsType = typeof initialState

const projectionParams = (state = initialState, action): ProjectionParamsType => {
    switch (action.type) {
        case SET:
            return action.projectionParams
        default:
            return state
    }
}

export default projectionParams