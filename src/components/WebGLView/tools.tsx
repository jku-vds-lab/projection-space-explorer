import { pointInHull } from '../Utility/Geometry/Intersection';
import type { IBaseProjection, Dataset } from '../../model';

export class LassoSelection {
  drawing: boolean;

  start: { x; y };

  points: { x; y }[];

  constructor() {
    this.drawing = false;
    this.start = { x: 0, y: 0 };
    this.points = [];
  }

  mouseDown(alt, x, y) {
    if (!this.drawing && alt) {
      this.drawing = true;

      this.start = { x, y };
      this.points = [this.start];
    }
  }

  mouseMove(x, y) {
    if (this.drawing) {
      this.points.push({ x, y });
    }
  }

  mouseUp(x, y) {
    if (this.drawing) {
      this.points.push({
        x,
        y,
      });

      this.points.push(this.start);

      this.drawing = false;
    }
  }

  selection(dataset: Dataset, workspace: IBaseProjection, visible) {
    const indices = [];
    dataset.vectors.forEach((vector, index) => {
      if (visible(vector) && this.intersects(workspace[index])) {
        indices.push(index);
      }
    });
    return indices;
  }

  intersects = (seat) => pointInHull(seat, this.points);
}
