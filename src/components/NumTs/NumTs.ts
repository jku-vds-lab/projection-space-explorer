/**
 * Calculates the eclidean distance between 2 vectors
 *
 * @param x1 The x component of the first vector
 * @param y1 The y component of the first vector
 * @param x2 The x component of the second vector
 * @param y2 The y component of the second vector
 */
export function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function euclideanDistanceVec(v1: VectorType, v2: VectorType) {
  return euclideanDistance(v1.x, v1.y, v2.x, v2.y);
}

export function getSyncNodesAlt(nodes1: any[], nodes2: any[]) {
  const convert = (nodes) => {
    const edges = [];
    nodes.forEach((node, index) => {
      if (index !== nodes.length - 1) {
        edges.push({ source: node, destination: nodes[index + 1] });
      }
    });

    return {
      nodes,
      edges,
    };
  };

  const main = convert(nodes1);
  const side = convert(nodes2);

  const splits = [];

  main.nodes.forEach((cluster, index) => {
    // Sync node needs to be in both
    if (!side.nodes.includes(cluster)) {
      return;
    }

    let outSplit = false;
    let inSplit = false;

    const mainIndex = index;
    const sideIndex = side.nodes.indexOf(cluster);

    const belowMainEdge = main.edges[mainIndex];
    const belowSideEdge = side.edges[sideIndex];

    const aboveMainEdge = main.edges[mainIndex - 1];
    const aboveSideEdge = side.edges[sideIndex - 1];

    // out direction differs
    if (belowMainEdge && belowSideEdge) {
      if (belowMainEdge.source !== belowSideEdge.source || belowMainEdge.destination !== belowSideEdge.destination) {
        outSplit = true;
      }
    }

    // in direction differs
    if (aboveMainEdge && aboveSideEdge) {
      if (aboveMainEdge.source !== aboveSideEdge.source || aboveMainEdge.destination !== aboveSideEdge.destination) {
        inSplit = true;
      }
    }

    if ((belowMainEdge && !belowSideEdge) || (!belowMainEdge && belowSideEdge)) {
      outSplit = true;
    }

    if ((!aboveMainEdge && aboveSideEdge) || (aboveMainEdge && !aboveSideEdge)) {
      inSplit = true;
    }

    if (outSplit || inSplit) {
      splits.push({ index, in: inSplit, out: outSplit });
    }
  });

  return splits;
}

export type VectorType = {
  x: number;
  y: number;
};

/**
 * Math class for vector calculations.
 */
export class VectBase implements VectorType {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  lerp(v: VectorType, alpha: number) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }

  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  static subtract(a, b) {
    return new VectBase(a.x - b.x, a.y - b.y);
  }

  static add(a, b) {
    return new VectBase(a.x + b.x, a.y + b.y);
  }
}

export function std(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map((x) => (x - mean) ** 2).reduce((a, b) => a + b) / n);
}

export function mean(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return mean;
}
