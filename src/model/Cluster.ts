import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { Dataset } from './Dataset';
import { ObjectTypes } from './ObjectType';
import { TypedObject } from './TypedObject';
import { IBaseProjection } from './ProjectionInterfaces';
import { ICluster } from './ICluster';

/**
 * Cluster API.
 */
export class ACluster {
  static calcBounds(positions: IBaseProjection, indices: number[]) {
    const samples = indices.map((i) => positions[i]);

    // Get rectangle that fits around data set
    let minX = 1000;
    let maxX = -1000;
    let minY = 1000;
    let maxY = -1000;

    samples.forEach((sample) => {
      minX = Math.min(minX, sample.x);
      maxX = Math.max(maxX, sample.x);
      minY = Math.min(minY, sample.y);
      maxY = Math.max(maxY, sample.y);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      left: minX,
      top: minY,
      right: maxX,
      bottom: maxY,
    };
  }

  static fromSamples(dataset: Dataset, samples: number[], metadata?: any): ICluster {
    return {
      id: uuidv4(),
      objectType: ObjectTypes.Cluster,
      indices: samples,
      label: Math.floor(Math.random() * 1000),
      metadata,
    };
  }

  static getCenterFromWorkspace(positions: IBaseProjection, cluster: ICluster) {
    let x = 0;
    let y = 0;

    cluster.indices
      .map((i) => positions[i])
      .forEach((p) => {
        x += p.x;
        y += p.y;
      });

    return {
      x: x / cluster.indices.length,
      y: y / cluster.indices.length,
    };
  }

  static getCenterAsVector2(positions: IBaseProjection, cluster: ICluster) {
    const center = ACluster.getCenterFromWorkspace(positions, cluster);
    return new THREE.Vector2(center.x, center.y);
  }

  static getTextRepresentation(cluster: ICluster) {
    if (cluster.name) {
      return `${cluster.label} / ${cluster.name}`;
    }
    return `${cluster.label}`;
  }
}

/**
 * Cluster type guard.
 */
export function isCluster(object: TypedObject): object is ICluster {
  if (object?.objectType == null) return false;
  return object && object.objectType === ObjectTypes.Cluster;
}
