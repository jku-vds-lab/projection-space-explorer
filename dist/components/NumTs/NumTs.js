"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Calculates the eclidean distance between 2 vectors
 *
 * @param x1 The x component of the first vector
 * @param y1 The y component of the first vector
 * @param x2 The x component of the second vector
 * @param y2 The y component of the second vector
 */
function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
exports.euclideanDistance = euclideanDistance;
function euclideanDistanceVec(v1, v2) {
    return euclideanDistance(v1.x, v1.y, v2.x, v2.y);
}
exports.euclideanDistanceVec = euclideanDistanceVec;
function getSyncNodesAlt(nodes1, nodes2) {
    const convert = (nodes) => {
        let edges = [];
        nodes.forEach((node, index) => {
            if (index != nodes.length - 1) {
                edges.push({ source: node, destination: nodes[index + 1] });
            }
        });
        return {
            nodes: nodes,
            edges: edges
        };
    };
    let main = convert(nodes1);
    let side = convert(nodes2);
    let splits = [];
    main.nodes.forEach((cluster, index) => {
        // Sync node needs to be in both
        if (!side.nodes.includes(cluster)) {
            return;
        }
        let outSplit = false;
        let inSplit = false;
        let mainIndex = index;
        let sideIndex = side.nodes.indexOf(cluster);
        let belowMainEdge = main.edges[mainIndex];
        let belowSideEdge = side.edges[sideIndex];
        let aboveMainEdge = main.edges[mainIndex - 1];
        let aboveSideEdge = side.edges[sideIndex - 1];
        // out direction differs
        if (belowMainEdge && belowSideEdge) {
            if (belowMainEdge.source != belowSideEdge.source || belowMainEdge.destination != belowSideEdge.destination) {
                outSplit = true;
            }
        }
        // in direction differs
        if (aboveMainEdge && aboveSideEdge) {
            if (aboveMainEdge.source != aboveSideEdge.source || aboveMainEdge.destination != aboveSideEdge.destination) {
                inSplit = true;
            }
        }
        if (belowMainEdge && !belowSideEdge || !belowMainEdge && belowSideEdge) {
            outSplit = true;
        }
        if (!aboveMainEdge && aboveSideEdge || aboveMainEdge && !aboveSideEdge) {
            inSplit = true;
        }
        if (outSplit || inSplit) {
            splits.push({ index: index, in: inSplit, out: outSplit });
        }
    });
    return splits;
}
exports.getSyncNodesAlt = getSyncNodesAlt;
/**
 * Math class for vector calculations.
 */
class VectBase {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    lerp(v, alpha) {
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
exports.VectBase = VectBase;
function std(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}
exports.std = std;
function mean(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return mean;
}
exports.mean = mean;
