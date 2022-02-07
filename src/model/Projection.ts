import { v4 as uuidv4 } from 'uuid';
import { IBaseProjection, IProjection } from './ProjectionInterfaces';
import type { ProjectionParamsType } from '../components/Ducks/ProjectionParamsDuck';

/**
 * Projection API.
 */
export class AProjection {
  static createProjection(projection: IBaseProjection, name, metadata?: any): IProjection {
    const hash = uuidv4();

    const deriveName = (metadata: ProjectionParamsType) => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

      return `${metadata.method} at ${time}`;
    };

    if (name === null && metadata) {
      return {
        positions: projection,
        hash,
        name: deriveName(metadata),
        metadata,
      };
    }
    return {
      positions: projection,
      hash,
      name,
      metadata,
    };
  }
}
