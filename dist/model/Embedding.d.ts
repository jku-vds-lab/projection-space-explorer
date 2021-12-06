/**
 * position type
 */
export declare type IPosition = {
    x: number;
    y: number;
};
/**
 * Projection item that also contains a name and a hash
 */
export declare type IProjection = {
    positions: IBaseProjection;
    name: string;
    hash: string;
};
/**
 * Base type for projections
 */
export declare type IBaseProjection = IPosition[];
export declare class EmbeddingUtil {
    static createEmbedding(projection: IBaseProjection, name: any): IProjection;
}
