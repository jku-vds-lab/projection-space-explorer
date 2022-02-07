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
    metadata?: {
        [id: string]: any;
    };
};
export declare type ITemporaryProjection = {
    positions: IBaseProjection;
    metadata?: {
        [id: string]: any;
    };
    hash: string;
};
/**
 * Base type for projections
 */
export declare type IBaseProjection = IPosition[];
