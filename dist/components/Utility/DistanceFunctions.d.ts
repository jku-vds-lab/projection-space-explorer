export declare function gower(featureTypes: []): (x: number[], y: number[]) => number;
export declare function jaccard(x: number[], y: number[]): any;
export declare function euclidean(x: number[], y: number[]): number;
export declare function manhattan(x: number[], y: number[]): number;
export declare function cosine(x: number[], y: number[]): number;
export declare function get_distance_fn(distanceMetric: any, e: any): typeof jaccard;
