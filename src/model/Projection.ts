import { v4 as uuidv4 } from 'uuid';
import { IBaseProjection, IProjection, ProjectionMethod } from './ProjectionInterfaces';
import type { ProjectionParamsType } from '../components/Ducks/ProjectionParamsDuck';

/**
 * Projection API.
 */
export class AProjection {
  static createProjection(positions: IBaseProjection, name, metadata?: any): IProjection {
    const hash = uuidv4();

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
      };
    }
    return {
      positions: positions.map((p) => ({ x: p.x, y: p.y })),
      hash,
      name,
      metadata,
    };
  }

  static createManualProjection(xChannel: string, yChannel: string): IProjection {
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
    };
  }
}
