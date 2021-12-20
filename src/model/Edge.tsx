import { ObjectTypes } from "./ObjectType";
import { TypedObject } from "./TypedObject";

/**
 * Edge type.
 */
export interface IEdge extends TypedObject {
    /**
     * Object type.
     */
    objectType: string;

    /**
     * Handle to source cluster.
     */
    source: string;

    /**
     * Handle to destination cluster.
     */
    destination: string;

    /**
     * Optional name for this edge (will be displayed like a street name).
     */
    name?: string;
}




/**
 * Edge type guard.
 */
export function isEdge(value: TypedObject): value is IEdge {
    return value && value.objectType === ObjectTypes.Edge
}
