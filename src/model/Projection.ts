import { v4 as uuidv4 } from 'uuid';
import { IBaseProjection, IProjection, ProjectionMethod } from './ProjectionInterfaces';
import type { ProjectionParamsType } from '../components/Ducks/ProjectionParamsDuck';
import { ADataset, Dataset } from './Dataset';

/**
 * Projection API.
 */
export class AProjection {
  static createProjection(positions: IBaseProjection, name, metadata?: any): IProjection {
    const hash = uuidv4();
    const bounds = AProjection.calculateBoundsFromPositions(positions);

    const deriveName = (metadata: ProjectionParamsType) => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

      return `${metadata.method} at ${time}`;
    };

    if (name === null && metadata) {
      return {
        positions: positions.map((p) => ({ x: p.x, y: p.y })),
        hash,
        name: deriveName(metadata),
        metadata,
        bounds,
      };
    }
    return {
      positions: positions.map((p) => ({ x: p.x, y: p.y })),
      hash,
      name,
      metadata,
      bounds,
    };
  }

  static createManualProjection(dataset: Dataset, xChannel: string, yChannel: string): IProjection {
    const hash = uuidv4();

    return {
      hash,
      xChannel,
      yChannel,
      metadata: {
        method: ProjectionMethod.CUSTOM,
      },
      positions: null,
      name: null,
      bounds: AProjection.calculateBounds(dataset, xChannel, yChannel),
    };
  }

  /**
   * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
   * which is needed for the zoom to work correctly
   */
  static calculateBoundsFromPositions(spatial: IBaseProjection) {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    spatial.forEach((s) => {
      minX = Math.min(minX, s.x);
      maxX = Math.max(maxX, s.x);
      minY = Math.min(minY, s.y);
      maxY = Math.max(maxY, s.y);
    });

    const scaleBase = 100;
    const absoluteMaximum = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));

    return {
      scaleBase,
      scaleFactor: absoluteMaximum / scaleBase,
      x: {
        min: minX,
        max: maxX,
      },
      y: {
        min: minY,
        max: maxY,
      },
    };
  }

  /**
   * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
   * which is needed for the zoom to work correctly
   */
  static calculateBounds(dataset: Dataset, xChannel, yChannel, positions?) {
    const spatial = ADataset.getSpatialData(dataset, xChannel, yChannel, positions);
    
    return AProjection.calculateBoundsFromPositions(spatial);
  }
}
