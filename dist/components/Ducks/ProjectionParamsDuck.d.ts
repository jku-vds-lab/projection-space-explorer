import { NormalizationMethod } from "../../model/NormalizationMethod";
import { DistanceMetric } from "../../model/DistanceMetric";
import { EncodingMethod } from "../../model/EncodingMethod";
export declare const setProjectionParamsAction: (projectionParams: any) => {
    type: string;
    projectionParams: any;
};
declare const initialState: {
    perplexity: number;
    learningRate: number;
    nNeighbors: number;
    iterations: number;
    seeded: boolean;
    useSelection: boolean;
    method: string;
    distanceMetric: DistanceMetric;
    normalizationMethod: NormalizationMethod;
    encodingMethod: EncodingMethod;
};
declare type ProjectionParamsState = typeof initialState;
declare const projectionParams: (state: {
    perplexity: number;
    learningRate: number;
    nNeighbors: number;
    iterations: number;
    seeded: boolean;
    useSelection: boolean;
    method: string;
    distanceMetric: DistanceMetric;
    normalizationMethod: NormalizationMethod;
    encodingMethod: EncodingMethod;
}, action: any) => ProjectionParamsState;
export default projectionParams;
