import { ObjectTypes } from "./ObjectType";
import { TypedObject } from "./TypedObject";

/**
 * Edge class that is a connection between 2 nodes.
 */
export interface Edge extends TypedObject {
    source: string;
    destination: string;
    bundle?: number[];
    name?: string;
    objectType: string;
}


export function isEdge(value: TypedObject): value is Edge {
    return value && value.objectType === ObjectTypes.Edge
}
