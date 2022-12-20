import { EntityId } from '@reduxjs/toolkit';
import { ObjectTypes } from './ObjectType';
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
export function isEdge(value: TypedObject): value is IEdge {
  if (value?.objectType == null) return false;
  return value && value.objectType === ObjectTypes.Edge;
}
