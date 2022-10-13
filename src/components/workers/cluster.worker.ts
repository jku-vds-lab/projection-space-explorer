/* @refresh reset */
/* eslint-disable no-restricted-globals */
import * as concaveman from 'concaveman';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ctx: Worker = self as any;

function validKey(key: string | number) {
  if (typeof key === 'number' && key < 0) {
    return false;
  }

  return true;
}

/**
 * Clustering endpoint that
 */
self.addEventListener('message', function (e) {
  if (e.data.type === 'extract') {
    // From input data [ [label], [label]... ] generate the clusters with triangulation
    const clusters = {};

    e.data.message.forEach((vector, index) => {
      const [x, y, labels] = vector;

      labels.forEach((label) => {
        // If we have a new
        if (!(label in clusters)) {
          clusters[label] = { points: [] };
        }

        clusters[label].points.push({
          label,
          probability: 1.0,
          meshIndex: index,
          x,
          y,
        });
      });
    });

    Object.keys(clusters).forEach((key) => {
      if (!validKey(key)) return;
      const cluster = clusters[key];

      const bounds = {
        minX: 10000,
        maxX: -10000,
        minY: 10000,
        maxY: -10000,
      };

      const pts = cluster.points.map((point) => {
        const { x } = point;
        const { y } = point;

        if (x < bounds.minX) bounds.minX = x;
        if (x > bounds.maxX) bounds.maxX = x;
        if (y < bounds.minY) bounds.minY = y;
        if (y > bounds.maxY) bounds.maxY = y;

        return [x, y];
      });

      // Get hull of cluster
      const polygon = concaveman(pts);

      cluster.hull = polygon;
    });

    const context = self as any;
    context.postMessage(clusters);
  }
});

export default null as any;
