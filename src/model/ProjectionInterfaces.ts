export const ProjectionMethod = {
  TSNE: 'tsne',
  UMAP: 'umap',
  FORCEATLAS2: 'forceatlas2',
  CUSTOM: 'custom',
  RANDOM: 'random',
  DATASET: 'dataset',
};

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

  xChannel?: string;
  yChannel?: string;

  metadata?: { [id: string]: any };
};

/**
 * Base type for projections
 */

export type IBaseProjection = IPosition[];
