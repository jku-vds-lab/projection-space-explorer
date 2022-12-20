/**
 * Calculates the eclidean distance between 2 vectors
 *
 * @param x1 The x component of the first vector
 * @param y1 The y component of the first vector
 * @param x2 The x component of the second vector
 * @param y2 The y component of the second vector
 */
export declare function euclideanDistance(x1: number, y1: number, x2: number, y2: number): number;
export declare function euclideanDistanceVec(v1: VectorType, v2: VectorType): number;
export declare function getSyncNodesAlt(nodes1: any[], nodes2: any[]): any[];
export type VectorType = {
    x: number;
    y: number;
};
/**
 * Math class for vector calculations.
 */
export declare class VectBase implements VectorType {
    x: number;
    y: number;
    constructor(x: number, y: number);
    lerp(v: VectorType, alpha: number): this;
    angle(): number;
    multiplyScalar(scalar: any): this;
    length(): number;
    divideScalar(scalar: any): this;
    normalize(): this;
    static subtract(a: any, b: any): VectBase;
    static add(a: any, b: any): VectBase;
}
export declare function std(array: any): number;
export declare function mean(array: any): number;
