(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PSE"] = factory();
	else
		root["PSE"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/workers/embeddings/forceatlas2.worker.ts":
/*!*****************************************************************!*\
  !*** ./src/components/workers/embeddings/forceatlas2.worker.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var graphology__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphology */ "./node_modules/graphology/dist/graphology.umd.min.js");
/* harmony import */ var graphology__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphology__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable no-multi-assign */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable prefer-rest-params */

/* eslint-disable no-restricted-globals */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable no-lonely-if */

/* eslint-disable no-param-reassign */

/* eslint no-constant-condition: 0 */

/**
 * Graphology ForceAtlas2 Iteration
 * =================================
 *
 * Function used to perform a single iteration of the algorithm.
 */

/**
 * Matrices properties accessors.
 */

var NODE_X = 0;
var NODE_Y = 1;
var NODE_DX = 2;
var NODE_DY = 3;
var NODE_OLD_DX = 4;
var NODE_OLD_DY = 5;
var NODE_MASS = 6;
var NODE_CONVERGENCE = 7;
var NODE_SIZE = 8;
var NODE_FIXED = 9;
var EDGE_SOURCE = 0;
var EDGE_TARGET = 1;
var EDGE_WEIGHT = 2;
var REGION_NODE = 0;
var REGION_CENTER_X = 1;
var REGION_CENTER_Y = 2;
var REGION_SIZE = 3;
var REGION_NEXT_SIBLING = 4;
var REGION_FIRST_CHILD = 5;
var REGION_MASS = 6;
var REGION_MASS_CENTER_X = 7;
var REGION_MASS_CENTER_Y = 8;
var SUBDIVISION_ATTEMPTS = 3;
/**
 * Constants.
 */

var PPN = 10;
var PPE = 3;
var PPR = 9;
var MAX_FORCE = 10;
/**
 * Function used to perform a single interation of the algorithm.
 *
 * @param  {object}       options    - Layout options.
 * @param  {Float32Array} NodeMatrix - Node data.
 * @param  {Float32Array} EdgeMatrix - Edge data.
 * @return {object}                  - Some metadata.
 */

function iterate(options, NodeMatrix, EdgeMatrix) {
  // Initializing variables
  var l;
  var r;
  var n;
  var n1;
  var n2;
  var rn;
  var e;
  var w;
  var g;
  var s;
  var order = NodeMatrix.length;
  var size = EdgeMatrix.length;
  var adjustSizes = options.adjustSizes;
  var thetaSquared = options.barnesHutTheta * options.barnesHutTheta;
  var outboundAttCompensation;
  var coefficient;
  var xDist;
  var yDist;
  var ewc;
  var distance;
  var factor;
  var RegionMatrix = []; // 1) Initializing layout data
  //-----------------------------
  // Resetting positions & computing max values

  for (n = 0; n < order; n += PPN) {
    NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];
    NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];
    NodeMatrix[n + NODE_DX] = 0;
    NodeMatrix[n + NODE_DY] = 0;
  } // If outbound attraction distribution, compensate


  if (options.outboundAttractionDistribution) {
    outboundAttCompensation = 0;

    for (n = 0; n < order; n += PPN) {
      outboundAttCompensation += NodeMatrix[n + NODE_MASS];
    }

    outboundAttCompensation /= order / PPN;
  } // 1.bis) Barnes-Hut computation
  //------------------------------


  if (options.barnesHutOptimize) {
    // Setting up
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    var q;
    var q2;
    var subdivisionAttempts; // Computing min and max values

    for (n = 0; n < order; n += PPN) {
      minX = Math.min(minX, NodeMatrix[n + NODE_X]);
      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
    } // squarify bounds, it's a quadtree


    var dx = maxX - minX;
    var dy = maxY - minY;

    if (dx > dy) {
      minY -= (dx - dy) / 2;
      maxY = minY + dx;
    } else {
      minX -= (dy - dx) / 2;
      maxX = minX + dy;
    } // Build the Barnes Hut root region


    RegionMatrix[0 + REGION_NODE] = -1;
    RegionMatrix[0 + REGION_CENTER_X] = (minX + maxX) / 2;
    RegionMatrix[0 + REGION_CENTER_Y] = (minY + maxY) / 2;
    RegionMatrix[0 + REGION_SIZE] = Math.max(maxX - minX, maxY - minY);
    RegionMatrix[0 + REGION_NEXT_SIBLING] = -1;
    RegionMatrix[0 + REGION_FIRST_CHILD] = -1;
    RegionMatrix[0 + REGION_MASS] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_X] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_Y] = 0; // Add each node in the tree

    l = 1;

    for (n = 0; n < order; n += PPN) {
      // Current region, starting with root
      r = 0;
      subdivisionAttempts = SUBDIVISION_ATTEMPTS;

      while (true) {
        // Are there sub-regions?
        // We look at first child index
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // There are sub-regions
          // We just iterate to find a "leaf" of the tree
          // that is an empty region or a region with a single node
          // (see next case)
          // Find the quadrant of n
          if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD];
            } else {
              // Bottom Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
            }
          } else if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
            // Top Right quarter
            q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
          } else {
            // Bottom Right quarter
            q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
          } // Update center of mass and mass (we only do it for non-leave regions)


          RegionMatrix[r + REGION_MASS_CENTER_X] = (RegionMatrix[r + REGION_MASS_CENTER_X] * RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) / (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);
          RegionMatrix[r + REGION_MASS_CENTER_Y] = (RegionMatrix[r + REGION_MASS_CENTER_Y] * RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) / (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);
          RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS]; // Iterate on the right quadrant

          r = q;
          continue;
        } else {
          // There are no sub-regions: we are in a "leaf"
          // Is there a node in this leave?
          if (RegionMatrix[r + REGION_NODE] < 0) {
            // There is no node in region:
            // we record node n and go on
            RegionMatrix[r + REGION_NODE] = n;
            break;
          } else {
            // There is a node in this region
            // We will need to create sub-regions, stick the two
            // nodes (the old one r[0] and the new one n) in two
            // subregions. If they fall in the same quadrant,
            // we will iterate.
            // Create sub-regions
            RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;
            w = RegionMatrix[r + REGION_SIZE] / 2; // new size (half)
            // NOTE: we use screen coordinates
            // from Top Left to Bottom Right
            // Top Left sub-region

            g = RegionMatrix[r + REGION_FIRST_CHILD];
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0; // Bottom Left sub-region

            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0; // Top Right sub-region

            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0; // Bottom Right sub-region

            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = RegionMatrix[r + REGION_NEXT_SIBLING];
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;
            l += 4; // Now the goal is to find two different sub-regions
            // for the two nodes: the one previously recorded (r[0])
            // and the one we want to add (n)
            // Find the quadrant of the old node

            if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            } else {
              // Bottom Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            } // We remove r[0] from the region r, add its mass to r and record it in q


            RegionMatrix[r + REGION_MASS] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];
            RegionMatrix[r + REGION_MASS_CENTER_X] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
            RegionMatrix[r + REGION_MASS_CENTER_Y] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];
            RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];
            RegionMatrix[r + REGION_NODE] = -1; // Find the quadrant of n

            if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Right quarter
              q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            } else {
              // Bottom Right quarter
              q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            }

            if (q === q2) {
              // If both nodes are in the same quadrant,
              // we have to try it again on this quadrant
              if (subdivisionAttempts--) {
                r = q;
                continue; // while
              } else {
                // we are out of precision here, and we cannot subdivide anymore
                // but we have to break the loop anyway
                subdivisionAttempts = SUBDIVISION_ATTEMPTS;
                break; // while
              }
            } // If both quadrants are different, we record n
            // in its quadrant


            RegionMatrix[q2 + REGION_NODE] = n;
            break;
          }
        }
      }
    }
  } // 2) Repulsion
  //--------------
  // NOTES: adjustSizes = antiCollision & scalingRatio = coefficient


  if (options.barnesHutOptimize) {
    coefficient = options.scalingRatio; // Applying repulsion through regions

    for (n = 0; n < order; n += PPN) {
      // Computing leaf quad nodes iteration
      r = 0; // Starting with root region

      while (true) {
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // The region has sub-regions
          // We run the Barnes Hut test to see if we are at the right distance
          distance = Math.pow(NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X], 2) + Math.pow(NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y], 2);
          s = RegionMatrix[r + REGION_SIZE];

          if (4 * s * s / distance < thetaSquared) {
            // We treat the region as a single body, and we repulse
            xDist = NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];
            yDist = NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];

            if (adjustSizes === true) {
              // -- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / distance;
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor = -coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / Math.sqrt(distance);
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              // -- Linear Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] * RegionMatrix[r + REGION_MASS] / distance;
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } // When this is done, we iterate. We have to look at the next sibling.


            r = RegionMatrix[r + REGION_NEXT_SIBLING];
            if (r < 0) break; // No next sibling: we have finished the tree

            continue;
          } else {
            // The region is too close and we have to look at sub-regions
            r = RegionMatrix[r + REGION_FIRST_CHILD];
            continue;
          }
        } else {
          // The region has no sub-region
          // If there is a node r[0] and it is not n, then repulse
          rn = RegionMatrix[r + REGION_NODE];

          if (rn >= 0 && rn !== n) {
            xDist = NodeMatrix[n + NODE_X] - NodeMatrix[rn + NODE_X];
            yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[rn + NODE_Y];
            distance = xDist * xDist + yDist * yDist;

            if (adjustSizes === true) {
              // -- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / distance;
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor = -coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / Math.sqrt(distance);
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              // -- Linear Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] * NodeMatrix[rn + NODE_MASS] / distance;
                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }
          } // When this is done, we iterate. We have to look at the next sibling.


          r = RegionMatrix[r + REGION_NEXT_SIBLING];
          if (r < 0) break; // No next sibling: we have finished the tree

          continue;
        }
      }
    }
  } else {
    coefficient = options.scalingRatio; // Square iteration

    for (n1 = 0; n1 < order; n1 += PPN) {
      for (n2 = 0; n2 < n1; n2 += PPN) {
        // Common to both methods
        xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
        yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

        if (adjustSizes === true) {
          // -- Anticollision Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist) - NodeMatrix[n1 + NODE_SIZE] - NodeMatrix[n2 + NODE_SIZE];

          if (distance > 0) {
            factor = coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS] / distance / distance; // Updating nodes' dx and dy

            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;
            NodeMatrix[n2 + NODE_DX] += xDist * factor;
            NodeMatrix[n2 + NODE_DY] += yDist * factor;
          } else if (distance < 0) {
            factor = 100 * coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS]; // Updating nodes' dx and dy

            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;
            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        } else {
          // -- Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            factor = coefficient * NodeMatrix[n1 + NODE_MASS] * NodeMatrix[n2 + NODE_MASS] / distance / distance; // Updating nodes' dx and dy

            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;
            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        }
      }
    }
  } // 3) Gravity
  //------------


  g = options.gravity / options.scalingRatio;
  coefficient = options.scalingRatio;

  for (n = 0; n < order; n += PPN) {
    factor = 0; // Common to both methods

    xDist = NodeMatrix[n + NODE_X];
    yDist = NodeMatrix[n + NODE_Y];
    distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    if (options.strongGravityMode) {
      // -- Strong gravity
      if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
    } else {
      // -- Linear Anti-collision Repulsion n
      if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g / distance;
    } // Updating node's dx and dy


    NodeMatrix[n + NODE_DX] -= xDist * factor;
    NodeMatrix[n + NODE_DY] -= yDist * factor;
  } // 4) Attraction
  //---------------


  coefficient = 1 * (options.outboundAttractionDistribution ? outboundAttCompensation : 1); // TODO: simplify distance
  // TODO: coefficient is always used as -c --> optimize?

  for (e = 0; e < size; e += PPE) {
    n1 = EdgeMatrix[e + EDGE_SOURCE];
    n2 = EdgeMatrix[e + EDGE_TARGET];
    w = EdgeMatrix[e + EDGE_WEIGHT]; // Edge weight influence

    ewc = Math.pow(w, options.edgeWeightInfluence); // Common measures

    xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
    yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y]; // Applying attraction to nodes

    if (adjustSizes === true) {
      distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2) - NodeMatrix[n1 + NODE_SIZE] - NodeMatrix[n2 + NODE_SIZE]);

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          // -- LinLog Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          // -- LinLog Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance;
          }
        }
      } else if (options.outboundAttractionDistribution) {
        // -- Linear Degree Distributed Anti-collision Attraction
        if (distance > 0) {
          factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
        }
      } else {
        // -- Linear Anti-collision Attraction
        if (distance > 0) {
          factor = -coefficient * ewc;
        }
      }
    } else {
      distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          // -- LinLog Degree Distributed Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          // -- LinLog Attraction
          if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance;
        }
      } else if (options.outboundAttractionDistribution) {
        // -- Linear Attraction Mass Distributed
        // NOTE: Distance is set to 1 to override next condition
        distance = 1;
        factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
      } else {
        // -- Linear Attraction
        // NOTE: Distance is set to 1 to override next condition
        distance = 1;
        factor = -coefficient * ewc;
      }
    } // Updating nodes' dx and dy
    // TODO: if condition or factor = 1?


    if (distance > 0) {
      // Updating nodes' dx and dy
      NodeMatrix[n1 + NODE_DX] += xDist * factor;
      NodeMatrix[n1 + NODE_DY] += yDist * factor;
      NodeMatrix[n2 + NODE_DX] -= xDist * factor;
      NodeMatrix[n2 + NODE_DY] -= yDist * factor;
    }
  } // 5) Apply Forces
  //-----------------


  var force;
  var swinging;
  var traction;
  var nodespeed;
  var newX;
  var newY; // MATH: sqrt and square distances

  if (adjustSizes === true) {
    for (n = 0; n < order; n += PPN) {
      if (!NodeMatrix[n + NODE_FIXED]) {
        force = Math.sqrt(Math.pow(NodeMatrix[n + NODE_DX], 2) + Math.pow(NodeMatrix[n + NODE_DY], 2));

        if (force > MAX_FORCE) {
          NodeMatrix[n + NODE_DX] = NodeMatrix[n + NODE_DX] * MAX_FORCE / force;
          NodeMatrix[n + NODE_DY] = NodeMatrix[n + NODE_DY] * MAX_FORCE / force;
        }

        swinging = NodeMatrix[n + NODE_MASS] * Math.sqrt((NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]));
        traction = Math.sqrt((NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])) / 2;
        nodespeed = 0.1 * Math.log(1 + traction) / (1 + Math.sqrt(swinging)); // Updating node's positon

        newX = NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;
        newY = NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  } else {
    for (n = 0; n < order; n += PPN) {
      if (!NodeMatrix[n + NODE_FIXED]) {
        swinging = NodeMatrix[n + NODE_MASS] * Math.sqrt((NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]));
        traction = Math.sqrt((NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) * (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) + (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) * (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])) / 2;
        nodespeed = NodeMatrix[n + NODE_CONVERGENCE] * Math.log(1 + traction) / (1 + Math.sqrt(swinging)); // Updating node convergence

        NodeMatrix[n + NODE_CONVERGENCE] = Math.min(1, Math.sqrt(nodespeed * (Math.pow(NodeMatrix[n + NODE_DX], 2) + Math.pow(NodeMatrix[n + NODE_DY], 2)) / (1 + Math.sqrt(swinging)))); // Updating node's positon

        newX = NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;
        newY = NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  } // We return the information about the layout (no need to return the matrices)


  return {};
}
/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */


function validateSettings(settings) {
  if ('linLogMode' in settings && typeof settings.linLogMode !== 'boolean') return {
    message: 'the `linLogMode` setting should be a boolean.'
  };
  if ('outboundAttractionDistribution' in settings && typeof settings.outboundAttractionDistribution !== 'boolean') return {
    message: 'the `outboundAttractionDistribution` setting should be a boolean.'
  };
  if ('adjustSizes' in settings && typeof settings.adjustSizes !== 'boolean') return {
    message: 'the `adjustSizes` setting should be a boolean.'
  };
  if ('edgeWeightInfluence' in settings && typeof settings.edgeWeightInfluence !== 'number' && settings.edgeWeightInfluence < 0) return {
    message: 'the `edgeWeightInfluence` setting should be a number >= 0.'
  };
  if ('scalingRatio' in settings && typeof settings.scalingRatio !== 'number' && settings.scalingRatio < 0) return {
    message: 'the `scalingRatio` setting should be a number >= 0.'
  };
  if ('strongGravityMode' in settings && typeof settings.strongGravityMode !== 'boolean') return {
    message: 'the `strongGravityMode` setting should be a boolean.'
  };
  if ('gravity' in settings && typeof settings.gravity !== 'number' && settings.gravity < 0) return {
    message: 'the `gravity` setting should be a number >= 0.'
  };
  if ('slowDown' in settings && typeof settings.slowDown !== 'number' && settings.slowDown < 0) return {
    message: 'the `slowDown` setting should be a number >= 0.'
  };
  if ('barnesHutOptimize' in settings && typeof settings.barnesHutOptimize !== 'boolean') return {
    message: 'the `barnesHutOptimize` setting should be a boolean.'
  };
  if ('barnesHutTheta' in settings && typeof settings.barnesHutTheta !== 'number' && settings.barnesHutTheta < 0) return {
    message: 'the `barnesHutTheta` setting should be a number >= 0.'
  };
  return null;
}
/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {object}       - Both matrices.
 */


function graphToByteArrays(graph) {
  var nodes = graph.nodes();
  var edges = graph.edges();
  var order = nodes.length;
  var size = edges.length;
  var index = {};
  var i;
  var j;
  var NodeMatrix = new Float32Array(order * PPN);
  var EdgeMatrix = new Float32Array(size * PPE); // Iterate through nodes

  for (i = j = 0; i < order; i++) {
    // Node index
    index[nodes[i]] = j; // Populating byte array

    NodeMatrix[j] = graph.getNodeAttribute(nodes[i], 'x');
    NodeMatrix[j + 1] = graph.getNodeAttribute(nodes[i], 'y');
    NodeMatrix[j + 2] = 0;
    NodeMatrix[j + 3] = 0;
    NodeMatrix[j + 4] = 0;
    NodeMatrix[j + 5] = 0;
    NodeMatrix[j + 6] = 1 + graph.degree(nodes[i]);
    NodeMatrix[j + 7] = 1;
    NodeMatrix[j + 8] = graph.getNodeAttribute(nodes[i], 'size') || 1;
    NodeMatrix[j + 9] = 0;
    j += PPN;
  } // Iterate through edges


  for (i = j = 0; i < size; i++) {
    // Populating byte array
    EdgeMatrix[j] = index[graph.source(edges[i])];
    EdgeMatrix[j + 1] = index[graph.target(edges[i])];
    EdgeMatrix[j + 2] = graph.getEdgeAttribute(edges[i], 'weight') || 0;
    j += PPE;
  }

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
}
/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */


function assignLayoutChanges(graph, NodeMatrix) {
  var nodes = graph.nodes();

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    graph.setNodeAttribute(nodes[j], 'x', NodeMatrix[i]);
    graph.setNodeAttribute(nodes[j], 'y', NodeMatrix[i + 1]);
    j++;
  }
}
/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}        graph      - Target graph.
 * @param  {Float32Array} NodeMatrix - Node matrix.
 * @return {object}                  - Map to node positions.
 */


function collectLayoutChanges(graph, NodeMatrix) {
  var nodes = graph.nodes();
  var positions = Object.create(null);

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    positions[nodes[j]] = {
      x: NodeMatrix[i],
      y: NodeMatrix[i + 1]
    };
    j++;
  }

  return positions;
}

function assignH(target) {
  for (var _len = arguments.length, other = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    other[_key - 1] = arguments[_key];
  }

  target = target || {};
  var objects = Array.prototype.slice.call(arguments).slice(1);
  var i;
  var k;
  var l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i]) continue;

    for (k in objects[i]) {
      target[k] = objects[i][k];
    }
  }

  return target;
}

var DEFAULT_SETTINGS = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 0,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: false,
  barnesHutTheta: 0.5
};
self.addEventListener('message', function (e) {
  var postMessage = self.postMessage;
  var nodes = e.data.nodes;
  var edges = e.data.edges;
  var params = e.data.params;
  var graph = new (graphology__WEBPACK_IMPORTED_MODULE_0___default())();
  nodes.forEach(function (node) {
    graph.addNode(node.meshIndex, {
      x: node.x,
      y: node.y
    });
  });
  edges.forEach(function (edge) {
    graph.addEdge(edge.source, edge.destination);
  });
  var iterations = params.iterations; // Validating settings

  var settings = assignH({}, DEFAULT_SETTINGS, params.settings);
  var validationError = validateSettings(settings);
  if (validationError) throw new Error("graphology-layout-forceatlas2: ".concat(validationError.message)); // Building matrices

  var matrices = graphToByteArrays(graph);
  var i; // Iterating

  for (i = 0; i < iterations; i++) {
    if (i % Math.floor(iterations / 100) === 0) {
      var _res = collectLayoutChanges(graph, matrices.nodes);

      postMessage({
        type: 'progress',
        progress: i / iterations * 100,
        positions: _res
      });
    }

    iterate(settings, matrices.nodes, matrices.edges);
  }

  var res = collectLayoutChanges(graph, matrices.nodes);
  postMessage({
    type: 'finish',
    positions: res,
    progress: 0
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_graphology_dist_graphology_umd_min_js"], () => (__webpack_require__("./src/components/workers/embeddings/forceatlas2.worker.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_components_workers_embeddings_forceatlas2_worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkPSE"] = self["webpackChunkPSE"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_graphology_dist_graphology_umd_min_js").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=src_components_workers_embeddings_forceatlas2_worker_ts.js.map