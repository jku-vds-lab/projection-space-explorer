import { v4 as uuidv4 } from 'uuid';

/**
 * position type containing x and y coordinates.
 */
export type IPosition = {
    x: number
    y: number
}

/**
 * Projection item that also contains a name and a hash
 */
export type IProjection = {
    positions: IBaseProjection
    name: string
    hash: string
}

/**
 * Base type for projections
 */
export type IBaseProjection = IPosition[]


/**
 * Projection API.
 */
export class AProjection {
    static createProjection(projection: IBaseProjection, name): IProjection {
        const hash = uuidv4()

        return {
            positions: projection,
            hash,
            name
        }
    }
}