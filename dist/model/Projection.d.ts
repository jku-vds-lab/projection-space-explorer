/**
 * position type containing x and y coordinates.
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
/**
 * Projection API.
 */
export declare class AProjection {
    static createProjection(projection: IBaseProjection, name: any): IProjection;
}
