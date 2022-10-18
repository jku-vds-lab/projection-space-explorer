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


    const context = self as any;
    context.postMessage(clusters);
  }
});

export default null as any;
