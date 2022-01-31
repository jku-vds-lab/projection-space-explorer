import { v4 as uuidv4 } from 'uuid';
import { ProjectionParamsType } from '..';

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

    /**
     * Dictionary containing meta data about this specific projection
     */
    metadata?: { [id: string]: any; }
}

/**
 * Base type for projections
 */
export type IBaseProjection = IPosition[]


/**
 * Projection API.
 */
export class AProjection {
    static createProjection(projection: IBaseProjection, name, metadata?: any): IProjection {
        const hash = uuidv4()

        const deriveName = (metadata: ProjectionParamsType) => {
            const time = new Date().toLocaleTimeString('en-US', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});

            return `${metadata.method} at ${time}`;
        }

        if (name === null && metadata) {
            return {
                positions: projection,
                hash,
                name: deriveName(metadata),
                metadata
            }
        } else {
            return {
                positions: projection,
                hash,
                name,
                metadata
            }
        }
    }
}