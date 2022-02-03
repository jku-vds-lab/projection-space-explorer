/* eslint-disable no-restricted-globals */
import * as concaveman from 'concaveman';
import * as libtess from 'libtess';
import { isNumber } from 'util';
import * as backend_utils from '../../utils/backend-connect';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ctx: Worker = self as any;

const tessy = (function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    // console.log(data[0], data[1]);
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
  }
  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log(`expected TRIANGLES but got type: ${type}`);
    }
  }
  function errorcallback(errno) {
    console.log('error callback');
    console.log(`error number: ${errno}`);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords) {
    // console.log('combine callback');
    return [coords[0], coords[1], coords[2]];
  }
  function edgeCallback() {
    // don't really care about the flag, but need no-strip/no-fan behavior
    // console.log('edge flag: ' + flag);
  }

  const tessy = new libtess.GluTesselator();
  // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
})();

function triangulate(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  tessy.gluTessNormal(0, 0, 1);

  const triangleVerts = [];
  tessy.gluTessBeginPolygon(triangleVerts);

  for (let i = 0; i < contours.length; i++) {
    tessy.gluTessBeginContour();
    const contour = contours[i];
    for (let j = 0; j < contour.length; j += 2) {
      const coords = [contour[j], contour[j + 1], 0];
      tessy.gluTessVertex(coords, coords);
    }
    tessy.gluTessEndContour();
  }

  tessy.gluTessEndPolygon();

  return triangleVerts;
}

/**
 * Create cluster structures from raw data.
 */
function processClusters(raw, xy) {
  const clusters = {};
  raw.forEach((entry, index) => {
    const x = xy[index][0];
    const y = xy[index][1];

    const [label, probability, score] = entry;
    if (!(label in clusters)) {
      clusters[label] = { points: [] };
    }

    clusters[label].points.push({
      label,
      probability,
      meshIndex: index,
      x,
      y,
      score,
    });
  });

  return clusters;
}

function validKey(key: string) {
  if (isNumber(key) && key < 0) {
    return false;
  }

  return true;
}

/**
 * Clustering endpoint that
 */
self.addEventListener('message', function (e) {
  if (e.data.type === 'point') {
    const xy = e.data.load;

    fetch(`${backend_utils.BASE_URL}/hdbscan`, {
      method: 'POST',
      body: JSON.stringify(xy),
    }).then((response) => {
      response.json().then((values) => {
        // Get clusters
        const clusters = processClusters(values.result, xy);

        Object.keys(clusters).forEach((key) => {
          if (!validKey(key)) return;
          const cluster = clusters[key];

          const bounds = {
            minX: 10000,
            maxX: -10000,
            minY: 10000,
            maxY: -10000,
          };

          const pts = cluster.points
            .filter((e) => e.probability > 0.7)
            .map((e) => {
              const x = xy[e.meshIndex][0];
              const y = xy[e.meshIndex][1];

              if (x < bounds.minX) bounds.minX = x;
              if (x > bounds.maxX) bounds.maxX = x;
              if (y < bounds.minY) bounds.minY = y;
              if (y > bounds.maxY) bounds.maxY = y;

              return [x, y];
            });

          // Get hull of cluster
          const polygon = concaveman(pts);

          // Get triangulated hull for cluster
          const triangulated = triangulate([polygon.flat()]);

          cluster.hull = polygon;
          cluster.triangulation = triangulated;
        });

        const context = self as any;
        context.postMessage(clusters);
      });
    });
  } else if (e.data.type === 'segment') {
    const xy = e.data.load;

    fetch(`${backend_utils.BASE_URL}/segmentation`, {
      method: 'POST',
      body: JSON.stringify(xy),
    }).then((response) => {
      const context = self as any;
      response.json().then((values) => {
        context.postMessage(values);
      });
    });
  } else if (e.data.type === 'extract') {
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

      // Get triangulated hull for cluster
      const triangulated = triangulate([polygon.flat()]);

      cluster.hull = polygon;
      cluster.triangulation = triangulated;
    });

    const context = self as any;
    context.postMessage(clusters);
  }
});

export default null as any;
