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
    distanceMetric: string;
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
    distanceMetric: string;
}, action: any) => ProjectionParamsState;
export default projectionParams;
