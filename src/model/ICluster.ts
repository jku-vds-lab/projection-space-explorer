import { EntityId } from '@reduxjs/toolkit';
import { TypedObject } from './TypedObject';

/**
 * Cluster type.
 */

export interface ICluster extends TypedObject {
  id: EntityId;

  label: any;

  hull?: number[][];
  name?: string;

  metadata?: { [id: string]: any };

  /**
   * List of indices on the dataset vectors this cluster has.
   */
  indices: number[];
}
