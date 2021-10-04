import { IVector } from "./Vector";
declare type PositionType = {
    x: number;
    y: number;
    meshIndex: number;
};
/**
 * Helper class that holds 1 full embedding of a selection of vectors.
 */
export declare class Embedding {
    positions: PositionType[];
    name: string;
    hash: string;
    constructor(vectors: IVector[], name: any);
}
export {};
