import { EntityId } from '@reduxjs/toolkit';
import { TypedObject } from './TypedObject';
/**
 * Edge type.
 */
export interface IEdge extends TypedObject {
    id: EntityId;
    /**
     * Object type.
     */
    objectType: string;
    /**
     * Handle to source cluster.
     */
    source: EntityId;
    /**
     * Handle to destination cluster.
     */
    destination: EntityId;
    /**
     * Optional name for this edge (will be displayed like a street name).
     */
    name?: string;
}
/**
 * Edge type guard.
 */
export declare function isEdge(value: TypedObject): value is IEdge;
