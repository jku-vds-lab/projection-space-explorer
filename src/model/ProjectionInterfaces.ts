/**
 * position type containing x and y coordinates.
 */

export type IPosition = {
  x: number;
  y: number;
};
/**
 * Projection item that also contains a name and a hash
 */

export type IProjection = {
  positions: IBaseProjection;
  name: string;
  hash: string;

  /**
   * Dictionary containing meta data about this specific projection
   */
  metadata?: { [id: string]: any };
};
/**
 * Base type for projections
 */

export type IBaseProjection = IPosition[];
