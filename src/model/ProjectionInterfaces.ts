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

  metadata?: { [id: string]: any };
};

export type ITemporaryProjection = {
  positions: IBaseProjection;
  metadata?: { [id: string]: any };
  hash: string;
};

/**
 * Base type for projections
 */

export type IBaseProjection = IPosition[];
