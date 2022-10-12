"use strict";
(self["webpackChunkPSE"] = self["webpackChunkPSE"] || []).push([["src_components_Utility_DistanceFunctions_ts-src_components_Utility_UMAP_umap_ts"],{

/***/ "./src/components/Utility/DistanceFunctions.ts":
/*!*****************************************************!*\
  !*** ./src/components/Utility/DistanceFunctions.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cosine": () => (/* binding */ cosine),
/* harmony export */   "euclidean": () => (/* binding */ euclidean),
/* harmony export */   "get_distance_fn": () => (/* binding */ get_distance_fn),
/* harmony export */   "gower": () => (/* binding */ gower),
/* harmony export */   "jaccard": () => (/* binding */ jaccard),
/* harmony export */   "manhattan": () => (/* binding */ manhattan)
/* harmony export */ });
/* harmony import */ var jaccard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jaccard */ "./node_modules/jaccard/jaccard.js");
/* harmony import */ var jaccard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jaccard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/DistanceMetric */ "./src/model/DistanceMetric.ts");
/* harmony import */ var _model_FeatureType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../model/FeatureType */ "./src/model/FeatureType.ts");


 // for mixed datatypes
// gower's distance is usually normalized by the range of values of this feature;  we never see all values at once --> normalize between 0 and 1 before delivers same result

function gower(featureTypes) {
  return function (x, y) {
    var result = 0;

    for (var i = 0; i < x.length; i++) {
      switch (featureTypes[i]) {
        case _model_FeatureType__WEBPACK_IMPORTED_MODULE_2__.FeatureType.Quantitative:
          result += Math.abs(x[i] - y[i]);
          break;

        case _model_FeatureType__WEBPACK_IMPORTED_MODULE_2__.FeatureType.Binary:
          result += x[i] === y[i] ? 0 : 1; // this is equivalent to the formular for quantititive features when having binary data

          break;

        case _model_FeatureType__WEBPACK_IMPORTED_MODULE_2__.FeatureType.Categorical:
          result += x[i] === y[i] ? 0 : 1; // see binary

          break;

        case _model_FeatureType__WEBPACK_IMPORTED_MODULE_2__.FeatureType.Ordinal:
          // TODO: handle ordinal data
          break;

        default:
          break;
      }
    }

    return result;
  };
} // https://github.com/ecto/jaccard TODO: also for tsne and other projection methods

function jaccard(x, y) {
  return jaccard__WEBPACK_IMPORTED_MODULE_0__.distance(x, y);
}
function euclidean(x, y) {
  var result = 0;

  for (var i = 0; i < x.length; i++) {
    result += Math.pow(x[i] - y[i], 2);
  }

  return Math.sqrt(result);
}
function manhattan(x, y) {
  var result = 0;

  for (var i = 0; i < x.length; i++) {
    result += Math.abs(x[i] - y[i]);
  }

  return result;
}
function cosine(x, y) {
  var result = 0.0;
  var normX = 0.0;
  var normY = 0.0;

  for (var i = 0; i < x.length; i++) {
    result += x[i] * y[i];
    normX += Math.pow(x[i], 2);
    normY += Math.pow(y[i], 2);
  }

  if (normX === 0 && normY === 0) {
    return 0;
  }

  if (normX === 0 || normY === 0) {
    return 1.0;
  }

  return 1.0 - result / Math.sqrt(normX * normY);
}
function get_distance_fn(distanceMetric, e) {
  switch (distanceMetric) {
    case _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__.DistanceMetric.EUCLIDEAN:
      return euclidean;

    case _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__.DistanceMetric.JACCARD:
      return jaccard;

    case _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__.DistanceMetric.MANHATTAN:
      return manhattan;

    case _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__.DistanceMetric.COSINE:
      return cosine;

    case _model_DistanceMetric__WEBPACK_IMPORTED_MODULE_1__.DistanceMetric.GOWER:
      return gower(e.data.featureTypes);

    default:
      return euclidean;
  }
}

/***/ }),

/***/ "./src/components/Utility/UMAP/heap.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/heap.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildCandidates": () => (/* binding */ buildCandidates),
/* harmony export */   "deheapSort": () => (/* binding */ deheapSort),
/* harmony export */   "heapPush": () => (/* binding */ heapPush),
/* harmony export */   "makeHeap": () => (/* binding */ makeHeap),
/* harmony export */   "rejectionSample": () => (/* binding */ rejectionSample),
/* harmony export */   "smallestFlagged": () => (/* binding */ smallestFlagged),
/* harmony export */   "uncheckedHeapPush": () => (/* binding */ uncheckedHeapPush)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 *  Constructor for the heap objects. The heaps are used
 * for approximate nearest neighbor search, maintaining a list of potential
 * neighbors sorted by their distance. We also flag if potential neighbors
 * are newly added to the list or not. Internally this is stored as
 * a single array; the first axis determines whether we are looking at the
 * array of candidate indices, the array of distances, or the flag array for
 * whether elements are new or not. Each of these arrays are of shape
 * (``nPoints``, ``size``)
 */

function makeHeap(nPoints, size) {
  var makeArrays = function makeArrays(fillValue) {
    return _utils__WEBPACK_IMPORTED_MODULE_0__.empty(nPoints).map(function () {
      return _utils__WEBPACK_IMPORTED_MODULE_0__.filled(size, fillValue);
    });
  };

  var heap = [];
  heap.push(makeArrays(-1));
  heap.push(makeArrays(Infinity));
  heap.push(makeArrays(0));
  return heap;
}
/**
 * Generate n_samples many integers from 0 to pool_size such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */

function rejectionSample(nSamples, poolSize, random) {
  var result = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(nSamples);

  for (var i = 0; i < nSamples; i++) {
    var rejectSample = true;
    var j = 0;

    while (rejectSample) {
      j = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRandInt(poolSize, random);
      var broken = false;

      for (var k = 0; k < i; k++) {
        if (j === result[k]) {
          broken = true;
          break;
        }
      }

      if (!broken) rejectSample = false;
    }

    result[i] = j;
  }

  return result;
}
/**
 * Push a new element onto the heap. The heap stores potential neighbors
 * for each data point. The ``row`` parameter determines which data point we
 * are addressing, the ``weight`` determines the distance (for heap sorting),
 * the ``index`` is the element to add, and the flag determines whether this
 * is to be considered a new addition.
 */

function heapPush(heap, row, weight, index, flag) {
  row = Math.floor(row);
  var indices = heap[0][row];
  var weights = heap[1][row];
  var isNew = heap[2][row];

  if (weight >= weights[0]) {
    return 0;
  } // Break if we already have this element.


  for (var i = 0; i < indices.length; i++) {
    if (index === indices[i]) {
      return 0;
    }
  }

  return uncheckedHeapPush(heap, row, weight, index, flag);
}
/**
 * Push a new element onto the heap. The heap stores potential neighbors
 * for each data point. The ``row`` parameter determines which data point we
 * are addressing, the ``weight`` determines the distance (for heap sorting),
 * the ``index`` is the element to add, and the flag determines whether this
 * is to be considered a new addition.
 */

function uncheckedHeapPush(heap, row, weight, index, flag) {
  var indices = heap[0][row];
  var weights = heap[1][row];
  var isNew = heap[2][row];

  if (weight >= weights[0]) {
    return 0;
  } // Insert val at position zero


  weights[0] = weight;
  indices[0] = index;
  isNew[0] = flag; // Descend the heap, swapping values until the max heap criterion is met

  var i = 0;
  var iSwap = 0;

  while (true) {
    var ic1 = 2 * i + 1;
    var ic2 = ic1 + 1;
    var heapShape2 = heap[0][0].length;

    if (ic1 >= heapShape2) {
      break;
    } else if (ic2 >= heapShape2) {
      if (weights[ic1] > weight) {
        iSwap = ic1;
      } else {
        break;
      }
    } else if (weights[ic1] >= weights[ic2]) {
      if (weight < weights[ic1]) {
        iSwap = ic1;
      } else {
        break;
      }
    } else if (weight < weights[ic2]) {
      iSwap = ic2;
    } else {
      break;
    }

    weights[i] = weights[iSwap];
    indices[i] = indices[iSwap];
    isNew[i] = isNew[iSwap];
    i = iSwap;
  }

  weights[i] = weight;
  indices[i] = index;
  isNew[i] = flag;
  return 1;
}
/**
 * Build a heap of candidate neighbors for nearest neighbor descent. For
 * each vertex the candidate neighbors are any current neighbors, and any
 * vertices that have the vertex as one of their nearest neighbors.
 */

function buildCandidates(currentGraph, nVertices, nNeighbors, maxCandidates, random) {
  var candidateNeighbors = makeHeap(nVertices, maxCandidates);

  for (var i = 0; i < nVertices; i++) {
    for (var j = 0; j < nNeighbors; j++) {
      if (currentGraph[0][i][j] < 0) {
        continue;
      }

      var idx = currentGraph[0][i][j];
      var isn = currentGraph[2][i][j];
      var d = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRand(random);
      heapPush(candidateNeighbors, i, d, idx, isn);
      heapPush(candidateNeighbors, idx, d, i, isn);
      currentGraph[2][i][j] = 0;
    }
  }

  return candidateNeighbors;
}
/**
 * Given an array of heaps (of indices and weights), unpack the heap
 * out to give and array of sorted lists of indices and weights by increasing
 * weight. This is effectively just the second half of heap sort (the first
 * half not being required since we already have the data in a heap).
 */

function deheapSort(heap) {
  var indices = heap[0];
  var weights = heap[1];

  for (var i = 0; i < indices.length; i++) {
    var indHeap = indices[i];
    var distHeap = weights[i];

    for (var j = 0; j < indHeap.length - 1; j++) {
      var indHeapIndex = indHeap.length - j - 1;
      var distHeapIndex = distHeap.length - j - 1;
      var temp1 = indHeap[0];
      indHeap[0] = indHeap[indHeapIndex];
      indHeap[indHeapIndex] = temp1;
      var temp2 = distHeap[0];
      distHeap[0] = distHeap[distHeapIndex];
      distHeap[distHeapIndex] = temp2;
      siftDown(distHeap, indHeap, distHeapIndex, 0);
    }
  }

  return {
    indices: indices,
    weights: weights
  };
}
/**
 * Restore the heap property for a heap with an out of place element
 * at position ``elt``. This works with a heap pair where heap1 carries
 * the weights and heap2 holds the corresponding elements.
 */

function siftDown(heap1, heap2, ceiling, elt) {
  while (elt * 2 + 1 < ceiling) {
    var leftChild = elt * 2 + 1;
    var rightChild = leftChild + 1;
    var swap = elt;

    if (heap1[swap] < heap1[leftChild]) {
      swap = leftChild;
    }

    if (rightChild < ceiling && heap1[swap] < heap1[rightChild]) {
      swap = rightChild;
    }

    if (swap === elt) {
      break;
    } else {
      var temp1 = heap1[elt];
      heap1[elt] = heap1[swap];
      heap1[swap] = temp1;
      var temp2 = heap2[elt];
      heap2[elt] = heap2[swap];
      heap2[swap] = temp2;
      elt = swap;
    }
  }
}
/**
 * Search the heap for the smallest element that is still flagged.
 */


function smallestFlagged(heap, row) {
  var ind = heap[0][row];
  var dist = heap[1][row];
  var flag = heap[2][row];
  var minDist = Infinity;
  var resultIndex = -1;

  for (var i = 0; i > ind.length; i++) {
    if (flag[i] === 1 && dist[i] < minDist) {
      minDist = dist[i];
      resultIndex = i;
    }
  }

  if (resultIndex >= 0) {
    flag[resultIndex] = 0;
    return Math.floor(ind[resultIndex]);
  }

  return -1;
}

/***/ }),

/***/ "./src/components/Utility/UMAP/matrix.ts":
/*!***********************************************!*\
  !*** ./src/components/Utility/UMAP/matrix.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SparseMatrix": () => (/* binding */ SparseMatrix),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "eliminateZeros": () => (/* binding */ eliminateZeros),
/* harmony export */   "getCSR": () => (/* binding */ getCSR),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "maximum": () => (/* binding */ maximum),
/* harmony export */   "multiplyScalar": () => (/* binding */ multiplyScalar),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "pairwiseMultiply": () => (/* binding */ pairwiseMultiply),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
var _normFns;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 * Internal 2-dimensional sparse matrix class
 */

var SparseMatrix = /*#__PURE__*/function () {
  function SparseMatrix(rows, cols, values, dims) {
    _classCallCheck(this, SparseMatrix);

    this.entries = new Map();
    this.nRows = 0;
    this.nCols = 0;

    if (rows.length !== cols.length || rows.length !== values.length) {
      throw new Error('rows, cols and values arrays must all have the same length');
    } // TODO: Assert that dims are legit.


    this.nRows = dims[0];
    this.nCols = dims[1];

    for (var i = 0; i < values.length; i++) {
      var row = rows[i];
      var col = cols[i];
      this.checkDims(row, col);
      var key = this.makeKey(row, col);
      this.entries.set(key, {
        value: values[i],
        row: row,
        col: col
      });
    }
  }

  _createClass(SparseMatrix, [{
    key: "makeKey",
    value: function makeKey(row, col) {
      return "".concat(row, ":").concat(col);
    }
  }, {
    key: "checkDims",
    value: function checkDims(row, col) {
      var withinBounds = row < this.nRows && col < this.nCols;

      if (!withinBounds) {
        throw new Error('row and/or col specified outside of matrix dimensions');
      }
    }
  }, {
    key: "set",
    value: function set(row, col, value) {
      this.checkDims(row, col);
      var key = this.makeKey(row, col);

      if (!this.entries.has(key)) {
        this.entries.set(key, {
          value: value,
          row: row,
          col: col
        });
      } else {
        this.entries.get(key).value = value;
      }
    }
  }, {
    key: "get",
    value: function get(row, col) {
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      this.checkDims(row, col);
      var key = this.makeKey(row, col);

      if (this.entries.has(key)) {
        return this.entries.get(key).value;
      }

      return defaultValue;
    }
  }, {
    key: "getAll",
    value: function getAll() {
      var ordered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var rowColValues = [];
      this.entries.forEach(function (value) {
        rowColValues.push(value);
      });

      if (ordered) {
        // Ordering the result isn't required for processing but it does make it easier to write tests
        rowColValues.sort(function (a, b) {
          if (a.row === b.row) {
            return a.col - b.col;
          }

          return a.row - b.row;
        });
      }

      return rowColValues;
    }
  }, {
    key: "getDims",
    value: function getDims() {
      return [this.nRows, this.nCols];
    }
  }, {
    key: "getRows",
    value: function getRows() {
      return Array.from(this.entries, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return value.row;
      });
    }
  }, {
    key: "getCols",
    value: function getCols() {
      return Array.from(this.entries, function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        return value.col;
      });
    }
  }, {
    key: "getValues",
    value: function getValues() {
      return Array.from(this.entries, function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];

        return value.value;
      });
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      this.entries.forEach(function (value) {
        return fn(value.value, value.row, value.col);
      });
    }
  }, {
    key: "map",
    value: function map(fn) {
      var vals = [];
      this.entries.forEach(function (value) {
        vals.push(fn(value.value, value.row, value.col));
      });
      var dims = [this.nRows, this.nCols];
      return new SparseMatrix(this.getRows(), this.getCols(), vals, dims);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var _this = this;

      var rows = _utils__WEBPACK_IMPORTED_MODULE_0__.empty(this.nRows);
      var output = rows.map(function () {
        return _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(_this.nCols);
      });
      this.entries.forEach(function (value) {
        output[value.row][value.col] = value.value;
      });
      return output;
    }
  }]);

  return SparseMatrix;
}();
/**
 * Transpose a sparse matrix
 */

function transpose(matrix) {
  var cols = [];
  var rows = [];
  var vals = [];
  matrix.forEach(function (value, row, col) {
    cols.push(row);
    rows.push(col);
    vals.push(value);
  });
  var dims = [matrix.nCols, matrix.nRows];
  return new SparseMatrix(rows, cols, vals, dims);
}
/**
 * Construct a sparse identity matrix
 */

function identity(size) {
  var _size = _slicedToArray(size, 1),
      rows = _size[0];

  var matrix = new SparseMatrix([], [], [], size);

  for (var i = 0; i < rows; i++) {
    matrix.set(i, i, 1);
  }

  return matrix;
}
/**
 * Element-wise multiplication of two matrices
 */

function pairwiseMultiply(a, b) {
  return elementWise(a, b, function (x, y) {
    return x * y;
  });
}
/**
 * Element-wise addition of two matrices
 */

function add(a, b) {
  return elementWise(a, b, function (x, y) {
    return x + y;
  });
}
/**
 * Element-wise subtraction of two matrices
 */

function subtract(a, b) {
  return elementWise(a, b, function (x, y) {
    return x - y;
  });
}
/**
 * Element-wise maximum of two matrices
 */

function maximum(a, b) {
  return elementWise(a, b, function (x, y) {
    return x > y ? x : y;
  });
}
/**
 * Scalar multiplication of two matrices
 */

function multiplyScalar(a, scalar) {
  return a.map(function (value) {
    return value * scalar;
  });
}
/**
 * Returns a new matrix with zero entries removed.
 */

function eliminateZeros(m) {
  var zeroIndices = new Set();
  var values = m.getValues();
  var rows = m.getRows();
  var cols = m.getCols();

  for (var i = 0; i < values.length; i++) {
    if (values[i] === 0) {
      zeroIndices.add(i);
    }
  }

  var removeByZeroIndex = function removeByZeroIndex(_, index) {
    return !zeroIndices.has(index);
  };

  var nextValues = values.filter(removeByZeroIndex);
  var nextRows = rows.filter(removeByZeroIndex);
  var nextCols = cols.filter(removeByZeroIndex);
  return new SparseMatrix(nextRows, nextCols, nextValues, m.getDims());
}
/**
 * Normalization of a sparse matrix.
 */

function normalize(m) {
  var normType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "l2";
  var normFn = normFns[normType];
  var colsByRow = new Map();
  m.forEach(function (_, row, col) {
    var cols = colsByRow.get(row) || [];
    cols.push(col);
    colsByRow.set(row, cols);
  });
  var nextMatrix = new SparseMatrix([], [], [], m.getDims());

  var _iterator = _createForOfIteratorHelper(colsByRow.keys()),
      _step;

  try {
    var _loop = function _loop() {
      var row = _step.value;
      var cols = colsByRow.get(row).sort();
      var vals = cols.map(function (col) {
        return m.get(row, col);
      });
      var norm = normFn(vals);

      for (var i = 0; i < norm.length; i++) {
        nextMatrix.set(row, cols[i], norm[i]);
      }
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return nextMatrix;
}
var normFns = (_normFns = {}, _defineProperty(_normFns, "max"
/* NormType.max */
, function max(xs) {
  var max = -Infinity;

  for (var i = 0; i < xs.length; i++) {
    max = xs[i] > max ? xs[i] : max;
  }

  return xs.map(function (x) {
    return x / max;
  });
}), _defineProperty(_normFns, "l1"
/* NormType.l1 */
, function l1(xs) {
  var sum = 0;

  for (var i = 0; i < xs.length; i++) {
    sum += xs[i];
  }

  return xs.map(function (x) {
    return x / sum;
  });
}), _defineProperty(_normFns, "l2"
/* NormType.l2 */
, function l2(xs) {
  var sum = 0;

  for (var i = 0; i < xs.length; i++) {
    sum += Math.pow(xs[i], 2);
  }

  return xs.map(function (x) {
    return Math.sqrt(Math.pow(x, 2) / sum);
  });
}), _normFns);
/**
 * Helper function for element-wise operations.
 */

function elementWise(a, b, op) {
  var visited = new Set();
  var rows = [];
  var cols = [];
  var vals = [];

  var operate = function operate(row, col) {
    rows.push(row);
    cols.push(col);
    var nextValue = op(a.get(row, col), b.get(row, col));
    vals.push(nextValue);
  };

  var valuesA = a.getValues();
  var rowsA = a.getRows();
  var colsA = a.getCols();

  for (var i = 0; i < valuesA.length; i++) {
    var row = rowsA[i];
    var col = colsA[i];
    var key = "".concat(row, ":").concat(col);
    visited.add(key);
    operate(row, col);
  }

  var valuesB = b.getValues();
  var rowsB = b.getRows();
  var colsB = b.getCols();

  for (var _i2 = 0; _i2 < valuesB.length; _i2++) {
    var _row = rowsB[_i2];
    var _col = colsB[_i2];

    var _key = "".concat(_row, ":").concat(_col);

    if (visited.has(_key)) continue;
    operate(_row, _col);
  }

  var dims = [a.nRows, a.nCols];
  return new SparseMatrix(rows, cols, vals, dims);
}
/**
 * Helper function for getting data, indices, and inptr arrays from a sparse
 * matrix to follow csr matrix conventions. Super inefficient (and kind of
 * defeats the purpose of this convention) but a lot of the ported python tree
 * search logic depends on this data format.
 */


function getCSR(x) {
  var entries = [];
  x.forEach(function (value, row, col) {
    entries.push({
      value: value,
      row: row,
      col: col
    });
  });
  entries.sort(function (a, b) {
    if (a.row === b.row) {
      return a.col - b.col;
    }

    return a.row - b.row;
  });
  var indices = [];
  var values = [];
  var indptr = [];
  var currentRow = -1;

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        row = _entries$i.row,
        col = _entries$i.col,
        value = _entries$i.value;

    if (row !== currentRow) {
      currentRow = row;
      indptr.push(i);
    }

    indices.push(col);
    values.push(value);
  }

  return {
    indices: indices,
    values: values,
    indptr: indptr
  };
}

/***/ }),

/***/ "./src/components/Utility/UMAP/nn_descent.ts":
/*!***************************************************!*\
  !*** ./src/components/Utility/UMAP/nn_descent.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initializeSearch": () => (/* binding */ initializeSearch),
/* harmony export */   "makeInitializations": () => (/* binding */ makeInitializations),
/* harmony export */   "makeInitializedNNSearch": () => (/* binding */ makeInitializedNNSearch),
/* harmony export */   "makeNNDescent": () => (/* binding */ makeNNDescent)
/* harmony export */ });
/* harmony import */ var _heap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./heap */ "./src/components/Utility/UMAP/heap.ts");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./src/components/Utility/UMAP/matrix.ts");
/* harmony import */ var _tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tree */ "./src/components/Utility/UMAP/tree.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 * This is a JavaScript reimplementation of UMAP (original license below), from
 * the python implementation found at https://github.com/lmcinnes/umap.
 *
 * @author andycoenen@google.com (Andy Coenen)
 */

/**
 * @license
 * BSD 3-Clause License
 *
 * Copyright (c) 2017, Leland McInnes
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */




/**
 * Create a version of nearest neighbor descent.
 */

function makeNNDescent(distanceFn, random) {
  return function nNDescent(data, leafArray, nNeighbors) {
    var nIters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var maxCandidates = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 50;
    var delta = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.001;
    var rho = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.5;
    var rpTreeInit = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
    var nVertices = data.length;
    var currentGraph = _heap__WEBPACK_IMPORTED_MODULE_0__.makeHeap(data.length, nNeighbors);

    for (var i = 0; i < data.length; i++) {
      var indices = _heap__WEBPACK_IMPORTED_MODULE_0__.rejectionSample(nNeighbors, data.length, random);

      for (var j = 0; j < indices.length; j++) {
        var d = distanceFn(data[i], data[indices[j]]);
        _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, i, d, indices[j], 1);
        _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, indices[j], d, i, 1);
      }
    }

    if (rpTreeInit) {
      for (var n = 0; n < leafArray.length; n++) {
        for (var _i = 0; _i < leafArray[n].length; _i++) {
          if (leafArray[n][_i] < 0) {
            break;
          }

          for (var _j = _i + 1; _j < leafArray[n].length; _j++) {
            if (leafArray[n][_j] < 0) {
              break;
            }

            var _d = distanceFn(data[leafArray[n][_i]], data[leafArray[n][_j]]);

            _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, leafArray[n][_i], _d, leafArray[n][_j], 1);
            _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, leafArray[n][_j], _d, leafArray[n][_i], 1);
          }
        }
      }
    }

    for (var _n = 0; _n < nIters; _n++) {
      var candidateNeighbors = _heap__WEBPACK_IMPORTED_MODULE_0__.buildCandidates(currentGraph, nVertices, nNeighbors, maxCandidates, random);
      var c = 0;

      for (var _i2 = 0; _i2 < nVertices; _i2++) {
        for (var _j2 = 0; _j2 < maxCandidates; _j2++) {
          var p = Math.floor(candidateNeighbors[0][_i2][_j2]);

          if (p < 0 || _utils__WEBPACK_IMPORTED_MODULE_3__.tauRand(random) < rho) {
            continue;
          }

          for (var k = 0; k < maxCandidates; k++) {
            var q = Math.floor(candidateNeighbors[0][_i2][k]);
            var cj = candidateNeighbors[2][_i2][_j2];
            var ck = candidateNeighbors[2][_i2][k];

            if (q < 0 || !cj && !ck) {
              continue;
            }

            var _d2 = distanceFn(data[p], data[q]);

            c += _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, p, _d2, q, 1);
            c += _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(currentGraph, q, _d2, p, 1);
          }
        }
      }

      if (c <= delta * nNeighbors * data.length) {
        break;
      }
    }

    var sorted = _heap__WEBPACK_IMPORTED_MODULE_0__.deheapSort(currentGraph);
    return sorted;
  };
}
function makeInitializations(distanceFn) {
  function initFromRandom(nNeighbors, data, queryPoints, _heap, random) {
    for (var i = 0; i < queryPoints.length; i++) {
      var indices = _utils__WEBPACK_IMPORTED_MODULE_3__.rejectionSample(nNeighbors, data.length, random);

      for (var j = 0; j < indices.length; j++) {
        if (indices[j] < 0) {
          continue;
        }

        var d = distanceFn(data[indices[j]], queryPoints[i]);
        _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(_heap, i, d, indices[j], 1);
      }
    }
  }

  function initFromTree(_tree, data, queryPoints, _heap, random) {
    for (var i = 0; i < queryPoints.length; i++) {
      var indices = _tree__WEBPACK_IMPORTED_MODULE_2__.searchFlatTree(queryPoints[i], _tree, random);

      for (var j = 0; j < indices.length; j++) {
        if (indices[j] < 0) {
          return;
        }

        var d = distanceFn(data[indices[j]], queryPoints[i]);
        _heap__WEBPACK_IMPORTED_MODULE_0__.heapPush(_heap, i, d, indices[j], 1);
      }
    }
  }

  return {
    initFromRandom: initFromRandom,
    initFromTree: initFromTree
  };
}
function makeInitializedNNSearch(distanceFn) {
  return function nnSearchFn(data, graph, initialization, queryPoints) {
    var _matrix$getCSR = _matrix__WEBPACK_IMPORTED_MODULE_1__.getCSR(graph),
        indices = _matrix$getCSR.indices,
        indptr = _matrix$getCSR.indptr;

    for (var i = 0; i < queryPoints.length; i++) {
      var tried = new Set(initialization[0][i]);

      while (true) {
        // Find smallest flagged vertex
        var vertex = _heap__WEBPACK_IMPORTED_MODULE_0__.smallestFlagged(initialization, i);

        if (vertex === -1) {
          break;
        }

        var candidates = indices.slice(indptr[vertex], indptr[vertex + 1]);

        var _iterator = _createForOfIteratorHelper(candidates),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var candidate = _step.value;

            if (candidate === vertex || candidate === -1 || tried.has(candidate)) {
              continue;
            }

            var d = distanceFn(data[candidate], queryPoints[i]);
            _heap__WEBPACK_IMPORTED_MODULE_0__.uncheckedHeapPush(initialization, i, d, candidate, 1);
            tried.add(candidate);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }

    return initialization;
  };
}
function initializeSearch(forest, data, queryPoints, nNeighbors, initFromRandom, initFromTree, random) {
  var results = _heap__WEBPACK_IMPORTED_MODULE_0__.makeHeap(queryPoints.length, nNeighbors);
  initFromRandom(nNeighbors, data, queryPoints, results, random);

  if (forest) {
    var _iterator2 = _createForOfIteratorHelper(forest),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _tree2 = _step2.value;
        initFromTree(_tree2, data, queryPoints, results, random);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return results;
}

/***/ }),

/***/ "./src/components/Utility/UMAP/tree.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/tree.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlatTree": () => (/* binding */ FlatTree),
/* harmony export */   "makeForest": () => (/* binding */ makeForest),
/* harmony export */   "makeLeafArray": () => (/* binding */ makeLeafArray),
/* harmony export */   "searchFlatTree": () => (/* binding */ searchFlatTree)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 * This is a JavaScript reimplementation of UMAP (original license below), from
 * the python implementation found at https://github.com/lmcinnes/umap.
 *
 * @author andycoenen@google.com (Andy Coenen)
 */

/**
 * @license
 * BSD 3-Clause License
 *
 * Copyright (c) 2017, Leland McInnes
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var FlatTree = /*#__PURE__*/_createClass(function FlatTree(hyperplanes, offsets, children, indices) {
  _classCallCheck(this, FlatTree);

  this.hyperplanes = hyperplanes;
  this.offsets = offsets;
  this.children = children;
  this.indices = indices;
});
/**
 * Build a random projection forest with ``nTrees``.
 */

function makeForest(data, nNeighbors, nTrees, random) {
  var leafSize = Math.max(10, nNeighbors);
  var trees = _utils__WEBPACK_IMPORTED_MODULE_0__.range(nTrees).map(function (_, i) {
    return makeTree(data, leafSize, i, random);
  });
  var forest = trees.map(function (tree) {
    return flattenTree(tree, leafSize);
  });
  return forest;
}
/**
 * Construct a random projection tree based on ``data`` with leaves
 * of size at most ``leafSize``
 */

function makeTree(data) {
  var leafSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var n = arguments.length > 2 ? arguments[2] : undefined;
  var random = arguments.length > 3 ? arguments[3] : undefined;
  var indices = _utils__WEBPACK_IMPORTED_MODULE_0__.range(data.length);
  var tree = makeEuclideanTree(data, indices, leafSize, n, random);
  return tree;
}

function makeEuclideanTree(data, indices) {
  var leafSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
  var q = arguments.length > 3 ? arguments[3] : undefined;
  var random = arguments.length > 4 ? arguments[4] : undefined;

  if (indices.length > leafSize) {
    var splitResults = euclideanRandomProjectionSplit(data, indices, random);
    var indicesLeft = splitResults.indicesLeft,
        indicesRight = splitResults.indicesRight,
        hyperplane = splitResults.hyperplane,
        offset = splitResults.offset;
    var leftChild = makeEuclideanTree(data, indicesLeft, leafSize, q + 1, random);
    var rightChild = makeEuclideanTree(data, indicesRight, leafSize, q + 1, random);
    var _node = {
      leftChild: leftChild,
      rightChild: rightChild,
      isLeaf: false,
      hyperplane: hyperplane,
      offset: offset
    };
    return _node;
  }

  var node = {
    indices: indices,
    isLeaf: true
  };
  return node;
}
/**
 * Given a set of ``indices`` for data points from ``data``, create
 * a random hyperplane to split the data, returning two arrays indices
 * that fall on either side of the hyperplane. This is the basis for a
 * random projection tree, which simply uses this splitting recursively.
 * This particular split uses euclidean distance to determine the hyperplane
 * and which side each data sample falls on.
 */


function euclideanRandomProjectionSplit(data, indices, random) {
  var dim = data[0].length; // Select two random points, set the hyperplane between them

  var leftIndex = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRandInt(indices.length, random);
  var rightIndex = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRandInt(indices.length, random);
  rightIndex += leftIndex === rightIndex ? 1 : 0;
  rightIndex %= indices.length;
  var left = indices[leftIndex];
  var right = indices[rightIndex]; // Compute the normal vector to the hyperplane (the vector between the two
  // points) and the offset from the origin

  var hyperplaneOffset = 0;
  var hyperplaneVector = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(dim);

  for (var i = 0; i < hyperplaneVector.length; i++) {
    hyperplaneVector[i] = data[left][i] - data[right][i];
    hyperplaneOffset -= hyperplaneVector[i] * (data[left][i] + data[right][i]) / 2.0;
  } // For each point compute the margin (project into normal vector)
  // If we are on lower side of the hyperplane put in one pile, otherwise
  // put it in the other pile (if we hit hyperplane on the nose, flip a coin)


  var nLeft = 0;
  var nRight = 0;
  var side = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(indices.length);

  for (var _i = 0; _i < indices.length; _i++) {
    var margin = hyperplaneOffset;

    for (var d = 0; d < dim; d++) {
      margin += hyperplaneVector[d] * data[indices[_i]][d];
    }

    if (margin === 0) {
      side[_i] = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRandInt(2, random);

      if (side[_i] === 0) {
        nLeft += 1;
      } else {
        nRight += 1;
      }
    } else if (margin > 0) {
      side[_i] = 0;
      nLeft += 1;
    } else {
      side[_i] = 1;
      nRight += 1;
    }
  } // Now that we have the counts, allocate arrays


  var indicesLeft = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(nLeft);
  var indicesRight = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(nRight); // Populate the arrays with indices according to which side they fell on

  nLeft = 0;
  nRight = 0;

  for (var _i2 in _utils__WEBPACK_IMPORTED_MODULE_0__.range(side.length)) {
    if (side[_i2] === 0) {
      indicesLeft[nLeft] = indices[_i2];
      nLeft += 1;
    } else {
      indicesRight[nRight] = indices[_i2];
      nRight += 1;
    }
  }

  return {
    indicesLeft: indicesLeft,
    indicesRight: indicesRight,
    hyperplane: hyperplaneVector,
    offset: hyperplaneOffset
  };
}

function flattenTree(tree, leafSize) {
  var nNodes = numNodes(tree);
  var nLeaves = numLeaves(tree); // TODO: Verify that sparse code is not relevant...

  var hyperplanes = _utils__WEBPACK_IMPORTED_MODULE_0__.range(nNodes).map(function () {
    return _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(tree.hyperplane ? tree.hyperplane.length : 0);
  });
  var offsets = _utils__WEBPACK_IMPORTED_MODULE_0__.zeros(nNodes);
  var children = _utils__WEBPACK_IMPORTED_MODULE_0__.range(nNodes).map(function () {
    return [-1, -1];
  });
  var indices = _utils__WEBPACK_IMPORTED_MODULE_0__.range(nLeaves).map(function () {
    return _utils__WEBPACK_IMPORTED_MODULE_0__.range(leafSize).map(function () {
      return -1;
    });
  });
  recursiveFlatten(tree, hyperplanes, offsets, children, indices, 0, 0);
  return new FlatTree(hyperplanes, offsets, children, indices);
}

function recursiveFlatten(tree, hyperplanes, offsets, children, indices, nodeNum, leafNum) {
  if (tree.isLeaf) {
    var _indices$leafNum;

    children[nodeNum][0] = -leafNum; // TODO: Triple check this operation corresponds to
    // indices[leafNum : tree.indices.shape[0]] = tree.indices

    (_indices$leafNum = indices[leafNum]).splice.apply(_indices$leafNum, [0, tree.indices.length].concat(_toConsumableArray(tree.indices)));

    leafNum += 1;
    return {
      nodeNum: nodeNum,
      leafNum: leafNum
    };
  }

  hyperplanes[nodeNum] = tree.hyperplane;
  offsets[nodeNum] = tree.offset;
  children[nodeNum][0] = nodeNum + 1;
  var oldNodeNum = nodeNum;
  var res = recursiveFlatten(tree.leftChild, hyperplanes, offsets, children, indices, nodeNum + 1, leafNum);
  nodeNum = res.nodeNum;
  leafNum = res.leafNum;
  children[oldNodeNum][1] = nodeNum + 1;
  res = recursiveFlatten(tree.rightChild, hyperplanes, offsets, children, indices, nodeNum + 1, leafNum);
  return {
    nodeNum: res.nodeNum,
    leafNum: res.leafNum
  };
}

function numNodes(tree) {
  if (tree.isLeaf) {
    return 1;
  }

  return 1 + numNodes(tree.leftChild) + numNodes(tree.rightChild);
}

function numLeaves(tree) {
  if (tree.isLeaf) {
    return 1;
  }

  return numLeaves(tree.leftChild) + numLeaves(tree.rightChild);
}
/**
 * Generate an array of sets of candidate nearest neighbors by
 * constructing a random projection forest and taking the leaves of all the
 * trees. Any given tree has leaves that are a set of potential nearest
 * neighbors. Given enough trees the set of all such leaves gives a good
 * likelihood of getting a good set of nearest neighbors in composite. Since
 * such a random projection forest is inexpensive to compute, this can be a
 * useful means of seeding other nearest neighbor algorithms.
 */


function makeLeafArray(rpForest) {
  if (rpForest.length > 0) {
    var output = [];

    var _iterator = _createForOfIteratorHelper(rpForest),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var tree = _step.value;
        output.push.apply(output, _toConsumableArray(tree.indices));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return output;
  }

  return [[-1]];
}
/**
 * Selects the side of the tree to search during flat tree search.
 */

function selectSide(hyperplane, offset, point, random) {
  var margin = offset;

  for (var d = 0; d < point.length; d++) {
    margin += hyperplane[d] * point[d];
  }

  if (margin === 0) {
    var side = _utils__WEBPACK_IMPORTED_MODULE_0__.tauRandInt(2, random);
    return side;
  }

  if (margin > 0) {
    return 0;
  }

  return 1;
}
/**
 * Searches a flattened rp-tree for a point.
 */


function searchFlatTree(point, tree, random) {
  var node = 0;

  while (tree.children[node][0] > 0) {
    var side = selectSide(tree.hyperplanes[node], tree.offsets[node], point, random);

    if (side === 0) {
      node = tree.children[node][0];
    } else {
      node = tree.children[node][1];
    }
  }

  var index = -1 * tree.children[node][0];
  return tree.indices[index];
}

/***/ }),

/***/ "./src/components/Utility/UMAP/umap.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/umap.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UMAP": () => (/* binding */ UMAP),
/* harmony export */   "cosine": () => (/* binding */ cosine),
/* harmony export */   "euclidean": () => (/* binding */ euclidean),
/* harmony export */   "fastIntersection": () => (/* binding */ fastIntersection),
/* harmony export */   "findABParams": () => (/* binding */ findABParams),
/* harmony export */   "initTransform": () => (/* binding */ initTransform),
/* harmony export */   "jaccard": () => (/* binding */ jaccard),
/* harmony export */   "resetLocalConnectivity": () => (/* binding */ resetLocalConnectivity)
/* harmony export */ });
/* harmony import */ var ml_levenberg_marquardt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ml-levenberg-marquardt */ "./node_modules/ml-levenberg-marquardt/src/index.js");
/* harmony import */ var _heap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./heap */ "./src/components/Utility/UMAP/heap.ts");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix */ "./src/components/Utility/UMAP/matrix.ts");
/* harmony import */ var _nn_descent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nn_descent */ "./src/components/Utility/UMAP/nn_descent.ts");
/* harmony import */ var _tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tree */ "./src/components/Utility/UMAP/tree.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
/* harmony import */ var jaccard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jaccard */ "./node_modules/jaccard/jaccard.js");
/* harmony import */ var jaccard__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jaccard__WEBPACK_IMPORTED_MODULE_6__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 * This is a JavaScript reimplementation of UMAP (original license below), from
 * the python implementation found at https://github.com/lmcinnes/umap.
 *
 * @author andycoenen@google.com (Andy Coenen)
 */

/**
 * @license
 * BSD 3-Clause License
 *
 * Copyright (c) 2017, Leland McInnes
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */







var SMOOTH_K_TOLERANCE = 1e-5;
var MIN_K_DIST_SCALE = 1e-3;
/**
 * UMAP projection system, based on the python implementation from McInnes, L,
 * Healy, J, UMAP: Uniform Manifold Approximation and Projection for Dimension
 * Reduction (https://github.com/lmcinnes/umap).
 *
 * This implementation differs in a few regards:
 * a) The initialization of the embedding for optimization is not computed using
 *    a spectral method, rather it is initialized randomly. This avoids some
 *    computationally intensive matrix eigen computations that aren't easily
 *    ported to JavaScript.
 * b) A lot of "extra" functionality has been omitted from this implementation,
 *    most notably a great deal of alternate distance functions.
 *
 * This implementation provides three methods of reducing dimensionality:
 * 1) fit: fit the data synchronously
 * 2) fitAsync: fit the data asynchronously, with a callback function provided
 *      that is invoked on each optimization step.
 * 3) initializeFit / step: manually initialize the algorithm then explictly
 *      step through each epoch of the SGD optimization
 */

var UMAP = /*#__PURE__*/function () {
  function UMAP() {
    var _this = this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UMAP);

    this.learningRate = 1.0;
    this.localConnectivity = 1.0;
    this.minDist = 0.1;
    this.nComponents = 2;
    this.nEpochs = 0;
    this.nNeighbors = 15;
    this.negativeSampleRate = 5;
    this.random = Math.random;
    this.repulsionStrength = 1.0;
    this.setOpMixRatio = 1.0;
    this.spread = 1.0;
    this.transformQueueSize = 4.0; // Supervised projection params

    this.targetMetric = "categorical"
    /* TargetMetric.categorical */
    ;
    this.targetWeight = 0.5;
    this.targetNNeighbors = this.nNeighbors;
    this.distanceFn = euclidean;
    this.isInitialized = false;
    this.rpForest = []; // Projected embedding

    this.embedding = [];
    this.optimizationState = new OptimizationState();

    var setParam = function setParam(key) {
      if (params[key] !== undefined) _this[key] = params[key];
    };

    setParam('distanceFn');
    setParam('learningRate');
    setParam('localConnectivity');
    setParam('minDist');
    setParam('nComponents');
    setParam('nEpochs');
    setParam('nNeighbors');
    setParam('negativeSampleRate');
    setParam('random');
    setParam('repulsionStrength');
    setParam('setOpMixRatio');
    setParam('spread');
    setParam('transformQueueSize');
  }
  /**
   * Fit the data to a projected embedding space synchronously.
   */


  _createClass(UMAP, [{
    key: "fit",
    value: function fit(X, initialEmbedding) {
      this.initializeFit(X, initialEmbedding);
      this.optimizeLayout();
      return this.embedding;
    }
    /**
     * Fit the data to a projected embedding space asynchronously, with a callback
     * function invoked on every epoch of optimization.
     */

  }, {
    key: "fitAsync",
    value: function () {
      var _fitAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(X, initialEmbedding) {
        var callback,
            _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                callback = _args.length > 2 && _args[2] !== undefined ? _args[2] : function () {
                  return true;
                };
                this.initializeFit(X, initialEmbedding);
                _context.next = 4;
                return this.optimizeLayoutAsync(callback);

              case 4:
                return _context.abrupt("return", this.embedding);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fitAsync(_x, _x2) {
        return _fitAsync.apply(this, arguments);
      }

      return fitAsync;
    }()
    /**
     * Initializes parameters needed for supervised projection.
     */

  }, {
    key: "setSupervisedProjection",
    value: function setSupervisedProjection(Y) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.Y = Y;
      this.targetMetric = params.targetMetric || this.targetMetric;
      this.targetWeight = params.targetWeight || this.targetWeight;
      this.targetNNeighbors = params.targetNNeighbors || this.targetNNeighbors;
    }
    /**
     * Initializes umap with precomputed KNN indices and distances.
     */

  }, {
    key: "setPrecomputedKNN",
    value: function setPrecomputedKNN(knnIndices, knnDistances) {
      this.knnIndices = knnIndices;
      this.knnDistances = knnDistances;
    }
    /**
     * Initializes fit by computing KNN and a fuzzy simplicial set, as well as
     * initializing the projected embeddings. Sets the optimization state ahead
     * of optimization steps. Returns the number of epochs to be used for the
     * SGD optimization.
     */

  }, {
    key: "initializeFit",
    value: function initializeFit(X, initialEmbedding) {
      if (X.length <= this.nNeighbors) {
        throw new Error("Not enough data points (".concat(X.length, ") to create nNeighbors: ").concat(this.nNeighbors, ".  Add more data points or adjust the configuration."));
      } // We don't need to reinitialize if we've already initialized for this data.


      if (this.X === X && this.isInitialized) {
        return this.getNEpochs();
      }

      this.X = X;

      if (!this.knnIndices && !this.knnDistances) {
        var knnResults = this.nearestNeighbors(X);
        this.knnIndices = knnResults.knnIndices;
        this.knnDistances = knnResults.knnDistances;
      }

      this.graph = this.fuzzySimplicialSet(X, this.nNeighbors, this.setOpMixRatio); // Set up the search graph for subsequent transformation.

      this.makeSearchFns();
      this.searchGraph = this.makeSearchGraph(X); // Check if supervised projection, then adjust the graph.

      this.processGraphForSupervisedProjection();

      var _this$initializeSimpl = this.initializeSimplicialSetEmbedding(initialEmbedding),
          head = _this$initializeSimpl.head,
          tail = _this$initializeSimpl.tail,
          epochsPerSample = _this$initializeSimpl.epochsPerSample; // Set the optimization routine state


      this.optimizationState.head = head;
      this.optimizationState.tail = tail;
      this.optimizationState.epochsPerSample = epochsPerSample; // Now, initialize the optimization steps

      this.initializeOptimization();
      this.prepareForOptimizationLoop();
      this.isInitialized = true;
      return this.getNEpochs();
    }
  }, {
    key: "makeSearchFns",
    value: function makeSearchFns() {
      var _nnDescent$makeInitia = _nn_descent__WEBPACK_IMPORTED_MODULE_3__.makeInitializations(this.distanceFn),
          initFromTree = _nnDescent$makeInitia.initFromTree,
          initFromRandom = _nnDescent$makeInitia.initFromRandom;

      this.initFromTree = initFromTree;
      this.initFromRandom = initFromRandom;
      this.search = _nn_descent__WEBPACK_IMPORTED_MODULE_3__.makeInitializedNNSearch(this.distanceFn);
    }
  }, {
    key: "makeSearchGraph",
    value: function makeSearchGraph(X) {
      var knnIndices = this.knnIndices;
      var knnDistances = this.knnDistances;
      var dims = [X.length, X.length];
      var searchGraph = new _matrix__WEBPACK_IMPORTED_MODULE_2__.SparseMatrix([], [], [], dims);

      for (var i = 0; i < knnIndices.length; i++) {
        var knn = knnIndices[i];
        var distances = knnDistances[i];

        for (var j = 0; j < knn.length; j++) {
          var neighbor = knn[j];
          var distance = distances[j];

          if (distance > 0) {
            searchGraph.set(i, neighbor, distance);
          }
        }
      }

      var transpose = _matrix__WEBPACK_IMPORTED_MODULE_2__.transpose(searchGraph);
      return _matrix__WEBPACK_IMPORTED_MODULE_2__.maximum(searchGraph, transpose);
    }
    /**
     * Transforms data to the existing embedding space.
     */

  }, {
    key: "transform",
    value: function transform(toTransform) {
      var _this2 = this;

      // Use the previous rawData
      var rawData = this.X;

      if (rawData === undefined || rawData.length === 0) {
        throw new Error('No data has been fit.');
      }

      var nNeighbors = Math.floor(this.nNeighbors * this.transformQueueSize);
      nNeighbors = Math.min(rawData.length, nNeighbors);
      var init = _nn_descent__WEBPACK_IMPORTED_MODULE_3__.initializeSearch(this.rpForest, rawData, toTransform, nNeighbors, this.initFromRandom, this.initFromTree, this.random);
      var result = this.search(rawData, this.searchGraph, init, toTransform);

      var _heap$deheapSort = _heap__WEBPACK_IMPORTED_MODULE_1__.deheapSort(result),
          indices = _heap$deheapSort.indices,
          distances = _heap$deheapSort.weights;

      indices = indices.map(function (x) {
        return x.slice(0, _this2.nNeighbors);
      });
      distances = distances.map(function (x) {
        return x.slice(0, _this2.nNeighbors);
      });
      var adjustedLocalConnectivity = Math.max(0, this.localConnectivity - 1);

      var _this$smoothKNNDistan = this.smoothKNNDistance(distances, this.nNeighbors, adjustedLocalConnectivity),
          sigmas = _this$smoothKNNDistan.sigmas,
          rhos = _this$smoothKNNDistan.rhos;

      var _this$computeMembersh = this.computeMembershipStrengths(indices, distances, sigmas, rhos),
          rows = _this$computeMembersh.rows,
          cols = _this$computeMembersh.cols,
          vals = _this$computeMembersh.vals;

      var size = [toTransform.length, rawData.length];
      var graph = new _matrix__WEBPACK_IMPORTED_MODULE_2__.SparseMatrix(rows, cols, vals, size); // This was a very specially constructed graph with constant degree.
      // That lets us do fancy unpacking by reshaping the csr matrix indices
      // and data. Doing so relies on the constant degree assumption!

      var normed = _matrix__WEBPACK_IMPORTED_MODULE_2__.normalize(graph, "l1"
      /* matrix.NormType.l1 */
      );
      var csrMatrix = _matrix__WEBPACK_IMPORTED_MODULE_2__.getCSR(normed);
      var nPoints = toTransform.length;
      var eIndices = _utils__WEBPACK_IMPORTED_MODULE_5__.reshape2d(csrMatrix.indices, nPoints, this.nNeighbors);
      var eWeights = _utils__WEBPACK_IMPORTED_MODULE_5__.reshape2d(csrMatrix.values, nPoints, this.nNeighbors);
      var embedding = initTransform(eIndices, eWeights, this.embedding);
      var nEpochs = this.nEpochs ? this.nEpochs / 3 : graph.nRows <= 10000 ? 100 : 30;
      var graphMax = graph.getValues().reduce(function (max, val) {
        return val > max ? val : max;
      }, 0);
      graph = graph.map(function (value) {
        return value < graphMax / nEpochs ? 0 : value;
      });
      graph = _matrix__WEBPACK_IMPORTED_MODULE_2__.eliminateZeros(graph);
      var epochsPerSample = this.makeEpochsPerSample(graph.getValues(), nEpochs);
      var head = graph.getRows();
      var tail = graph.getCols(); // Initialize optimization slightly differently than the fit method.

      this.assignOptimizationStateParameters({
        headEmbedding: embedding,
        tailEmbedding: this.embedding,
        head: head,
        tail: tail,
        currentEpoch: 0,
        nEpochs: nEpochs,
        nVertices: graph.getDims()[1],
        epochsPerSample: epochsPerSample
      });
      this.prepareForOptimizationLoop();
      return this.optimizeLayout();
    }
    /**
     * Checks if we're using supervised projection, then process the graph
     * accordingly.
     */

  }, {
    key: "processGraphForSupervisedProjection",
    value: function processGraphForSupervisedProjection() {
      var Y = this.Y,
          X = this.X;

      if (Y) {
        if (Y.length !== X.length) {
          throw new Error('Length of X and y must be equal');
        }

        if (this.targetMetric === "categorical"
        /* TargetMetric.categorical */
        ) {
          var lt = this.targetWeight < 1.0;
          var farDist = lt ? 2.5 * (1.0 / (1.0 - this.targetWeight)) : 1.0e12;
          this.graph = this.categoricalSimplicialSetIntersection(this.graph, Y, farDist);
        } // TODO (andycoenen@): add non-categorical supervised embeddings.

      }
    }
    /**
     * Manually step through the optimization process one epoch at a time.
     */

  }, {
    key: "step",
    value: function step() {
      var currentEpoch = this.optimizationState.currentEpoch;

      if (currentEpoch < this.getNEpochs()) {
        this.optimizeLayoutStep(currentEpoch);
      }

      return this.optimizationState.currentEpoch;
    }
    /**
     * Returns the computed projected embedding.
     */

  }, {
    key: "getEmbedding",
    value: function getEmbedding() {
      return this.embedding;
    }
    /**
     * Compute the ``nNeighbors`` nearest points for each data point in ``X``
     * This may be exact, but more likely is approximated via nearest neighbor
     * descent.
     */

  }, {
    key: "nearestNeighbors",
    value: function nearestNeighbors(X) {
      var distanceFn = this.distanceFn,
          nNeighbors = this.nNeighbors;

      var log2 = function log2(n) {
        return Math.log(n) / Math.log(2);
      };

      var metricNNDescent = _nn_descent__WEBPACK_IMPORTED_MODULE_3__.makeNNDescent(distanceFn, this.random); // Handle python3 rounding down from 0.5 discrpancy

      var round = function round(n) {
        return n === 0.5 ? 0 : Math.round(n);
      };

      var nTrees = 5 + Math.floor(round(Math.pow(X.length, 0.5) / 20.0));
      var nIters = Math.max(5, Math.floor(Math.round(log2(X.length))));
      this.rpForest = _tree__WEBPACK_IMPORTED_MODULE_4__.makeForest(X, nNeighbors, nTrees, this.random);
      var leafArray = _tree__WEBPACK_IMPORTED_MODULE_4__.makeLeafArray(this.rpForest);

      var _metricNNDescent = metricNNDescent(X, leafArray, nNeighbors, nIters),
          indices = _metricNNDescent.indices,
          weights = _metricNNDescent.weights;

      return {
        knnIndices: indices,
        knnDistances: weights
      };
    }
    /**
     * Given a set of data X, a neighborhood size, and a measure of distance
     * compute the fuzzy simplicial set (here represented as a fuzzy graph in
     * the form of a sparse matrix) associated to the data. This is done by
     * locally approximating geodesic distance at each point, creating a fuzzy
     * simplicial set for each such point, and then combining all the local
     * fuzzy simplicial sets into a global one via a fuzzy union.
     */

  }, {
    key: "fuzzySimplicialSet",
    value: function fuzzySimplicialSet(X, nNeighbors) {
      var setOpMixRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
      var _this$knnIndices = this.knnIndices,
          knnIndices = _this$knnIndices === void 0 ? [] : _this$knnIndices,
          _this$knnDistances = this.knnDistances,
          knnDistances = _this$knnDistances === void 0 ? [] : _this$knnDistances,
          localConnectivity = this.localConnectivity;

      var _this$smoothKNNDistan2 = this.smoothKNNDistance(knnDistances, nNeighbors, localConnectivity),
          sigmas = _this$smoothKNNDistan2.sigmas,
          rhos = _this$smoothKNNDistan2.rhos;

      var _this$computeMembersh2 = this.computeMembershipStrengths(knnIndices, knnDistances, sigmas, rhos),
          rows = _this$computeMembersh2.rows,
          cols = _this$computeMembersh2.cols,
          vals = _this$computeMembersh2.vals;

      var size = [X.length, X.length];
      var sparseMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_2__.SparseMatrix(rows, cols, vals, size);
      var transpose = _matrix__WEBPACK_IMPORTED_MODULE_2__.transpose(sparseMatrix);
      var prodMatrix = _matrix__WEBPACK_IMPORTED_MODULE_2__.pairwiseMultiply(sparseMatrix, transpose);
      var a = _matrix__WEBPACK_IMPORTED_MODULE_2__.subtract(_matrix__WEBPACK_IMPORTED_MODULE_2__.add(sparseMatrix, transpose), prodMatrix);
      var b = _matrix__WEBPACK_IMPORTED_MODULE_2__.multiplyScalar(a, setOpMixRatio);
      var c = _matrix__WEBPACK_IMPORTED_MODULE_2__.multiplyScalar(prodMatrix, 1.0 - setOpMixRatio);
      var result = _matrix__WEBPACK_IMPORTED_MODULE_2__.add(b, c);
      return result;
    }
    /**
     * Combine a fuzzy simplicial set with another fuzzy simplicial set
     * generated from categorical data using categorical distances. The target
     * data is assumed to be categorical label data (a vector of labels),
     * and this will update the fuzzy simplicial set to respect that label data.
     */

  }, {
    key: "categoricalSimplicialSetIntersection",
    value: function categoricalSimplicialSetIntersection(simplicialSet, target, farDist) {
      var unknownDist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
      var intersection = fastIntersection(simplicialSet, target, unknownDist, farDist);
      intersection = _matrix__WEBPACK_IMPORTED_MODULE_2__.eliminateZeros(intersection);
      return resetLocalConnectivity(intersection);
    }
    /**
     * Compute a continuous version of the distance to the kth nearest
     * neighbor. That is, this is similar to knn-distance but allows continuous
     * k values rather than requiring an integral k. In esscence we are simply
     * computing the distance such that the cardinality of fuzzy set we generate
     * is k.
     */

  }, {
    key: "smoothKNNDistance",
    value: function smoothKNNDistance(distances, k) {
      var localConnectivity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
      var nIter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 64;
      var bandwidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.0;
      var target = Math.log(k) / Math.log(2) * bandwidth;
      var rho = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(distances.length);
      var result = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(distances.length);

      for (var i = 0; i < distances.length; i++) {
        var lo = 0.0;
        var hi = Infinity;
        var mid = 1.0; // TODO: This is very inefficient, but will do for now. FIXME

        var ithDistances = distances[i];
        var nonZeroDists = ithDistances.filter(function (d) {
          return d > 0.0;
        });

        if (nonZeroDists.length >= localConnectivity) {
          var index = Math.floor(localConnectivity);
          var interpolation = localConnectivity - index;

          if (index > 0) {
            rho[i] = nonZeroDists[index - 1];

            if (interpolation > SMOOTH_K_TOLERANCE) {
              rho[i] += interpolation * (nonZeroDists[index] - nonZeroDists[index - 1]);
            }
          } else {
            rho[i] = interpolation * nonZeroDists[0];
          }
        } else if (nonZeroDists.length > 0) {
          rho[i] = _utils__WEBPACK_IMPORTED_MODULE_5__.max(nonZeroDists);
        }

        for (var n = 0; n < nIter; n++) {
          var psum = 0.0;

          for (var j = 1; j < distances[i].length; j++) {
            var d = distances[i][j] - rho[i];

            if (d > 0) {
              psum += Math.exp(-(d / mid));
            } else {
              psum += 1.0;
            }
          }

          if (Math.abs(psum - target) < SMOOTH_K_TOLERANCE) {
            break;
          }

          if (psum > target) {
            hi = mid;
            mid = (lo + hi) / 2.0;
          } else {
            lo = mid;

            if (hi === Infinity) {
              mid *= 2;
            } else {
              mid = (lo + hi) / 2.0;
            }
          }
        }

        result[i] = mid; // TODO: This is very inefficient, but will do for now. FIXME

        if (rho[i] > 0.0) {
          var meanIthDistances = _utils__WEBPACK_IMPORTED_MODULE_5__.mean(ithDistances);

          if (result[i] < MIN_K_DIST_SCALE * meanIthDistances) {
            result[i] = MIN_K_DIST_SCALE * meanIthDistances;
          }
        } else {
          var meanDistances = _utils__WEBPACK_IMPORTED_MODULE_5__.mean(distances.map(_utils__WEBPACK_IMPORTED_MODULE_5__.mean));

          if (result[i] < MIN_K_DIST_SCALE * meanDistances) {
            result[i] = MIN_K_DIST_SCALE * meanDistances;
          }
        }
      }

      return {
        sigmas: result,
        rhos: rho
      };
    }
    /**
     * Construct the membership strength data for the 1-skeleton of each local
     * fuzzy simplicial set -- this is formed as a sparse matrix where each row is
     * a local fuzzy simplicial set, with a membership strength for the
     * 1-simplex to each other data point.
     */

  }, {
    key: "computeMembershipStrengths",
    value: function computeMembershipStrengths(knnIndices, knnDistances, sigmas, rhos) {
      var nSamples = knnIndices.length;
      var nNeighbors = knnIndices[0].length;
      var rows = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(nSamples * nNeighbors);
      var cols = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(nSamples * nNeighbors);
      var vals = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(nSamples * nNeighbors);

      for (var i = 0; i < nSamples; i++) {
        for (var j = 0; j < nNeighbors; j++) {
          var val = 0;

          if (knnIndices[i][j] === -1) {
            continue; // We didn't get the full knn for i
          }

          if (knnIndices[i][j] === i) {
            val = 0.0;
          } else if (knnDistances[i][j] - rhos[i] <= 0.0) {
            val = 1.0;
          } else {
            val = Math.exp(-((knnDistances[i][j] - rhos[i]) / sigmas[i]));
          }

          rows[i * nNeighbors + j] = i;
          cols[i * nNeighbors + j] = knnIndices[i][j];
          vals[i * nNeighbors + j] = val;
        }
      }

      return {
        rows: rows,
        cols: cols,
        vals: vals
      };
    }
    /**
     * Initialize a fuzzy simplicial set embedding, using a specified
     * initialisation method and then minimizing the fuzzy set cross entropy
     * between the 1-skeletons of the high and low dimensional fuzzy simplicial
     * sets.
     */

  }, {
    key: "initializeSimplicialSetEmbedding",
    value: function initializeSimplicialSetEmbedding(initialEmbedding) {
      var _this3 = this;

      var nEpochs = this.getNEpochs();
      var nComponents = this.nComponents;
      var graphValues = this.graph.getValues();
      var graphMax = 0;

      for (var i = 0; i < graphValues.length; i++) {
        var value = graphValues[i];

        if (graphMax < graphValues[i]) {
          graphMax = value;
        }
      }

      var graph = this.graph.map(function (value) {
        if (value < graphMax / nEpochs) {
          return 0;
        }

        return value;
      }); // We're not computing the spectral initialization in this implementation
      // until we determine a better eigenvalue/eigenvector computation
      // approach

      if (initialEmbedding) {
        this.embedding = initialEmbedding;
      } else {
        this.embedding = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(graph.nRows).map(function () {
          return _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(nComponents).map(function () {
            return _utils__WEBPACK_IMPORTED_MODULE_5__.tauRand(_this3.random) * 20 + -10; // Random from -10 to 10
          });
        });
      } // Get graph data in ordered way...


      var weights = [];
      var head = [];
      var tail = [];
      var rowColValues = graph.getAll();

      for (var _i = 0; _i < rowColValues.length; _i++) {
        var entry = rowColValues[_i];

        if (entry.value) {
          weights.push(entry.value);
          tail.push(entry.row);
          head.push(entry.col);
        }
      }

      var epochsPerSample = this.makeEpochsPerSample(weights, nEpochs);
      return {
        head: head,
        tail: tail,
        epochsPerSample: epochsPerSample
      };
    }
    /**
     * Given a set of weights and number of epochs generate the number of
     * epochs per sample for each weight.
     */

  }, {
    key: "makeEpochsPerSample",
    value: function makeEpochsPerSample(weights, nEpochs) {
      var result = _utils__WEBPACK_IMPORTED_MODULE_5__.filled(weights.length, -1.0);
      var max = _utils__WEBPACK_IMPORTED_MODULE_5__.max(weights);
      var nSamples = weights.map(function (w) {
        return w / max * nEpochs;
      });
      nSamples.forEach(function (n, i) {
        if (n > 0) result[i] = nEpochs / nSamples[i];
      });
      return result;
    }
    /**
     * Assigns optimization state parameters from a partial optimization state.
     */

  }, {
    key: "assignOptimizationStateParameters",
    value: function assignOptimizationStateParameters(state) {
      Object.assign(this.optimizationState, state);
    }
    /**
     * Sets a few optimization state parameters that are necessary before entering
     * the optimization step loop.
     */

  }, {
    key: "prepareForOptimizationLoop",
    value: function prepareForOptimizationLoop() {
      // Hyperparameters
      var repulsionStrength = this.repulsionStrength,
          learningRate = this.learningRate,
          negativeSampleRate = this.negativeSampleRate;
      var _this$optimizationSta = this.optimizationState,
          epochsPerSample = _this$optimizationSta.epochsPerSample,
          headEmbedding = _this$optimizationSta.headEmbedding,
          tailEmbedding = _this$optimizationSta.tailEmbedding;
      var dim = headEmbedding[0].length;
      var moveOther = headEmbedding.length === tailEmbedding.length;
      var epochsPerNegativeSample = epochsPerSample.map(function (e) {
        return e / negativeSampleRate;
      });

      var epochOfNextNegativeSample = _toConsumableArray(epochsPerNegativeSample);

      var epochOfNextSample = _toConsumableArray(epochsPerSample);

      this.assignOptimizationStateParameters({
        epochOfNextSample: epochOfNextSample,
        epochOfNextNegativeSample: epochOfNextNegativeSample,
        epochsPerNegativeSample: epochsPerNegativeSample,
        moveOther: moveOther,
        initialAlpha: learningRate,
        alpha: learningRate,
        gamma: repulsionStrength,
        dim: dim
      });
    }
    /**
     * Initializes optimization state for stepwise optimization.
     */

  }, {
    key: "initializeOptimization",
    value: function initializeOptimization() {
      // Algorithm state
      var headEmbedding = this.embedding;
      var tailEmbedding = this.embedding; // Initialized in initializeSimplicialSetEmbedding()

      var _this$optimizationSta2 = this.optimizationState,
          head = _this$optimizationSta2.head,
          tail = _this$optimizationSta2.tail,
          epochsPerSample = _this$optimizationSta2.epochsPerSample;
      var nEpochs = this.getNEpochs();
      var nVertices = this.graph.nCols;

      var _findABParams = findABParams(this.spread, this.minDist),
          a = _findABParams.a,
          b = _findABParams.b;

      this.assignOptimizationStateParameters({
        headEmbedding: headEmbedding,
        tailEmbedding: tailEmbedding,
        head: head,
        tail: tail,
        epochsPerSample: epochsPerSample,
        a: a,
        b: b,
        nEpochs: nEpochs,
        nVertices: nVertices
      });
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */

  }, {
    key: "optimizeLayoutStep",
    value: function optimizeLayoutStep(n) {
      var optimizationState = this.optimizationState;
      var head = optimizationState.head,
          tail = optimizationState.tail,
          headEmbedding = optimizationState.headEmbedding,
          tailEmbedding = optimizationState.tailEmbedding,
          epochsPerSample = optimizationState.epochsPerSample,
          epochOfNextSample = optimizationState.epochOfNextSample,
          epochOfNextNegativeSample = optimizationState.epochOfNextNegativeSample,
          epochsPerNegativeSample = optimizationState.epochsPerNegativeSample,
          moveOther = optimizationState.moveOther,
          initialAlpha = optimizationState.initialAlpha,
          alpha = optimizationState.alpha,
          gamma = optimizationState.gamma,
          a = optimizationState.a,
          b = optimizationState.b,
          dim = optimizationState.dim,
          nEpochs = optimizationState.nEpochs,
          nVertices = optimizationState.nVertices;
      var clipValue = 4.0;

      for (var i = 0; i < epochsPerSample.length; i++) {
        if (epochOfNextSample[i] > n) {
          continue;
        }

        var j = head[i];
        var k = tail[i];
        var current = headEmbedding[j];
        var other = tailEmbedding[k];
        var distSquared = rDist(current, other);
        var gradCoeff = 0;

        if (distSquared > 0) {
          gradCoeff = -2.0 * a * b * Math.pow(distSquared, b - 1.0);
          gradCoeff /= a * Math.pow(distSquared, b) + 1.0;
        }

        for (var d = 0; d < dim; d++) {
          var gradD = clip(gradCoeff * (current[d] - other[d]), clipValue);
          current[d] += gradD * alpha;

          if (moveOther) {
            other[d] += -gradD * alpha;
          }
        }

        epochOfNextSample[i] += epochsPerSample[i];
        var nNegSamples = Math.floor((n - epochOfNextNegativeSample[i]) / epochsPerNegativeSample[i]);

        for (var p = 0; p < nNegSamples; p++) {
          var _k = _utils__WEBPACK_IMPORTED_MODULE_5__.tauRandInt(nVertices, this.random);

          var _other = tailEmbedding[_k];

          var _distSquared = rDist(current, _other);

          var _gradCoeff = 0.0;

          if (_distSquared > 0.0) {
            _gradCoeff = 2.0 * gamma * b;
            _gradCoeff /= (0.001 + _distSquared) * (a * Math.pow(_distSquared, b) + 1);
          } else if (j === _k) {
            continue;
          }

          for (var _d = 0; _d < dim; _d++) {
            var _gradD = 4.0;

            if (_gradCoeff > 0.0) {
              _gradD = clip(_gradCoeff * (current[_d] - _other[_d]), clipValue);
            }

            current[_d] += _gradD * alpha;
          }
        }

        epochOfNextNegativeSample[i] += nNegSamples * epochsPerNegativeSample[i];
      }

      optimizationState.alpha = initialAlpha * (1.0 - n / nEpochs);
      optimizationState.currentEpoch += 1;
      return headEmbedding;
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */

  }, {
    key: "optimizeLayoutAsync",
    value: function optimizeLayoutAsync() {
      var _this4 = this;

      var epochCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        return true;
      };
      return new Promise(function (resolve, reject) {
        var step = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _this4$optimizationSt, nEpochs, currentEpoch, epochCompleted, shouldStop, isFinished;

            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _this4$optimizationSt = _this4.optimizationState, nEpochs = _this4$optimizationSt.nEpochs, currentEpoch = _this4$optimizationSt.currentEpoch;
                    _this4.embedding = _this4.optimizeLayoutStep(currentEpoch);
                    epochCompleted = _this4.optimizationState.currentEpoch;
                    shouldStop = epochCallback(epochCompleted) === false;
                    isFinished = epochCompleted === nEpochs;

                    if (!(!shouldStop && !isFinished)) {
                      _context2.next = 10;
                      break;
                    }

                    setTimeout(function () {
                      return step();
                    }, 0);
                    _context2.next = 11;
                    break;

                  case 10:
                    return _context2.abrupt("return", resolve(isFinished));

                  case 11:
                    _context2.next = 16;
                    break;

                  case 13:
                    _context2.prev = 13;
                    _context2.t0 = _context2["catch"](0);
                    reject(_context2.t0);

                  case 16:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[0, 13]]);
          }));

          return function step() {
            return _ref.apply(this, arguments);
          };
        }();

        setTimeout(function () {
          return step();
        }, 0);
      });
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */

  }, {
    key: "optimizeLayout",
    value: function optimizeLayout() {
      var epochCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        return true;
      };
      var isFinished = false;
      var embedding = [];

      while (!isFinished) {
        var _this$optimizationSta3 = this.optimizationState,
            nEpochs = _this$optimizationSta3.nEpochs,
            currentEpoch = _this$optimizationSta3.currentEpoch;
        embedding = this.optimizeLayoutStep(currentEpoch);
        var epochCompleted = this.optimizationState.currentEpoch;
        var shouldStop = epochCallback(epochCompleted) === false;
        isFinished = epochCompleted === nEpochs || shouldStop;
      }

      return embedding;
    }
    /**
     * Gets the number of epochs for optimizing the projection.
     * NOTE: This heuristic differs from the python version
     */

  }, {
    key: "getNEpochs",
    value: function getNEpochs() {
      var graph = this.graph;

      if (this.nEpochs > 0) {
        return this.nEpochs;
      }

      var length = graph.nRows;

      if (length <= 2500) {
        return 500;
      }

      if (length <= 5000) {
        return 400;
      }

      if (length <= 7500) {
        return 300;
      }

      return 200;
    }
  }]);

  return UMAP;
}(); // https://github.com/ecto/jaccard TODO: also for tsne and other projection methods

function jaccard(x, y) {
  return jaccard__WEBPACK_IMPORTED_MODULE_6__.index(x, y);
}
function euclidean(x, y) {
  var result = 0;

  for (var i = 0; i < x.length; i++) {
    result += Math.pow(x[i] - y[i], 2);
  }

  return Math.sqrt(result);
}
function cosine(x, y) {
  var result = 0.0;
  var normX = 0.0;
  var normY = 0.0;

  for (var i = 0; i < x.length; i++) {
    result += x[i] * y[i];
    normX += Math.pow(x[i], 2);
    normY += Math.pow(y[i], 2);
  }

  if (normX === 0 && normY === 0) {
    return 0;
  }

  if (normX === 0 || normY === 0) {
    return 1.0;
  }

  return 1.0 - result / Math.sqrt(normX * normY);
}
/**
 * An interface representing the optimization state tracked between steps of
 * the SGD optimization
 */

var OptimizationState = /*#__PURE__*/_createClass(function OptimizationState() {
  _classCallCheck(this, OptimizationState);

  this.currentEpoch = 0; // Data tracked during optimization steps.

  this.headEmbedding = [];
  this.tailEmbedding = [];
  this.head = [];
  this.tail = [];
  this.epochsPerSample = [];
  this.epochOfNextSample = [];
  this.epochOfNextNegativeSample = [];
  this.epochsPerNegativeSample = [];
  this.moveOther = true;
  this.initialAlpha = 1.0;
  this.alpha = 1.0;
  this.gamma = 1.0;
  this.a = 1.5769434603113077;
  this.b = 0.8950608779109733;
  this.dim = 2;
  this.nEpochs = 500;
  this.nVertices = 0;
});
/**
 * Standard clamping of a value into a fixed range
 */


function clip(x, clipValue) {
  if (x > clipValue) return clipValue;
  if (x < -clipValue) return -clipValue;
  return x;
}
/**
 * Reduced Euclidean distance.
 */


function rDist(x, y) {
  var result = 0.0;

  for (var i = 0; i < x.length; i++) {
    result += Math.pow(x[i] - y[i], 2);
  }

  return result;
}
/**
 * Fit a, b params for the differentiable curve used in lower
 * dimensional fuzzy simplicial complex construction. We want the
 * smooth curve (from a pre-defined family with simple gradient) that
 * best matches an offset exponential decay.
 */


function findABParams(spread, minDist) {
  var curve = function curve(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        a = _ref3[0],
        b = _ref3[1];

    return function (x) {
      return 1.0 / (1.0 + a * Math.pow(x, 2 * b));
    };
  };

  var xv = _utils__WEBPACK_IMPORTED_MODULE_5__.linear(0, spread * 3, 300).map(function (val) {
    return val < minDist ? 1.0 : val;
  });
  var yv = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(xv.length).map(function (val, index) {
    var gte = xv[index] >= minDist;
    return gte ? Math.exp(-(xv[index] - minDist) / spread) : val;
  });
  var initialValues = [0.5, 0.5];
  var data = {
    x: xv,
    y: yv
  }; // Default options for the algorithm (from github example)

  var options = {
    damping: 1.5,
    initialValues: initialValues,
    gradientDifference: 10e-2,
    maxIterations: 100,
    errorTolerance: 10e-3
  };

  var _LM = (0,ml_levenberg_marquardt__WEBPACK_IMPORTED_MODULE_0__["default"])(data, curve, options),
      parameterValues = _LM.parameterValues;

  var _parameterValues = _slicedToArray(parameterValues, 2),
      a = _parameterValues[0],
      b = _parameterValues[1];

  return {
    a: a,
    b: b
  };
}
/**
 * Under the assumption of categorical distance for the intersecting
 * simplicial set perform a fast intersection.
 */

function fastIntersection(graph, target) {
  var unknownDist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
  var farDist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5.0;
  return graph.map(function (value, row, col) {
    if (target[row] === -1 || target[col] === -1) {
      return value * Math.exp(-unknownDist);
    }

    if (target[row] !== target[col]) {
      return value * Math.exp(-farDist);
    }

    return value;
  });
}
/**
 * Reset the local connectivity requirement -- each data sample should
 * have complete confidence in at least one 1-simplex in the simplicial set.
 * We can enforce this by locally rescaling confidences, and then remerging the
 * different local simplicial sets together.
 */

function resetLocalConnectivity(simplicialSet) {
  simplicialSet = _matrix__WEBPACK_IMPORTED_MODULE_2__.normalize(simplicialSet, "max"
  /* matrix.NormType.max */
  );
  var transpose = _matrix__WEBPACK_IMPORTED_MODULE_2__.transpose(simplicialSet);
  var prodMatrix = _matrix__WEBPACK_IMPORTED_MODULE_2__.pairwiseMultiply(transpose, simplicialSet);
  simplicialSet = _matrix__WEBPACK_IMPORTED_MODULE_2__.add(simplicialSet, _matrix__WEBPACK_IMPORTED_MODULE_2__.subtract(transpose, prodMatrix));
  return _matrix__WEBPACK_IMPORTED_MODULE_2__.eliminateZeros(simplicialSet);
}
/**
 * Given indices and weights and an original embeddings
 * initialize the positions of new points relative to the
 * indices and weights (of their neighbors in the source data).
 */

function initTransform(indices, weights, embedding) {
  var result = _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(indices.length).map(function (z) {
    return _utils__WEBPACK_IMPORTED_MODULE_5__.zeros(embedding[0].length);
  });

  for (var i = 0; i < indices.length; i++) {
    for (var j = 0; j < indices[0].length; j++) {
      for (var d = 0; d < embedding[0].length; d++) {
        var a = indices[i][j];
        result[i][d] += weights[i][j] * embedding[a][d];
      }
    }
  }

  return result;
}

/***/ }),

/***/ "./src/components/Utility/UMAP/utils.ts":
/*!**********************************************!*\
  !*** ./src/components/Utility/UMAP/utils.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "empty": () => (/* binding */ empty),
/* harmony export */   "filled": () => (/* binding */ filled),
/* harmony export */   "linear": () => (/* binding */ linear),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "max2d": () => (/* binding */ max2d),
/* harmony export */   "mean": () => (/* binding */ mean),
/* harmony export */   "norm": () => (/* binding */ norm),
/* harmony export */   "ones": () => (/* binding */ ones),
/* harmony export */   "range": () => (/* binding */ range),
/* harmony export */   "rejectionSample": () => (/* binding */ rejectionSample),
/* harmony export */   "reshape2d": () => (/* binding */ reshape2d),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "tauRand": () => (/* binding */ tauRand),
/* harmony export */   "tauRandInt": () => (/* binding */ tauRandInt),
/* harmony export */   "zeros": () => (/* binding */ zeros)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */

/**
 * Simple random integer function
 */
function tauRandInt(n, random) {
  return Math.floor(random() * n);
}
/**
 * Simple random float function
 */

function tauRand(random) {
  return random();
}
/**
 * Compute the (standard l2) norm of a vector.
 */

function norm(vec) {
  var result = 0;

  var _iterator = _createForOfIteratorHelper(vec),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      result += Math.pow(item, 2);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return Math.sqrt(result);
}
/**
 * Creates an empty array (filled with undefined)
 */

function empty(n) {
  var output = [];

  for (var i = 0; i < n; i++) {
    output.push(undefined);
  }

  return output;
}
/**
 * Creates an array filled with index values
 */

function range(n) {
  return empty(n).map(function (_, i) {
    return i;
  });
}
/**
 * Creates an array filled with a specific value
 */

function filled(n, v) {
  return empty(n).map(function () {
    return v;
  });
}
/**
 * Creates an array filled with zeros
 */

function zeros(n) {
  return filled(n, 0);
}
/**
 * Creates an array filled with ones
 */

function ones(n) {
  return filled(n, 1);
}
/**
 * Creates an array from a to b, of length len, inclusive
 */

function linear(a, b, len) {
  return empty(len).map(function (_, i) {
    return a + i * ((b - a) / (len - 1));
  });
}
/**
 * Returns the sum of an array
 */

function sum(input) {
  return input.reduce(function (sum, val) {
    return sum + val;
  });
}
/**
 * Returns the mean of an array
 */

function mean(input) {
  return sum(input) / input.length;
}
/**
 * Returns the maximum value of an array
 */

function max(input) {
  var max = 0;

  for (var i = 0; i < input.length; i++) {
    max = input[i] > max ? input[i] : max;
  }

  return max;
}
/**
 * Returns the maximum value of a 2d array
 */

function max2d(input) {
  var max = 0;

  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < input[i].length; j++) {
      max = input[i][j] > max ? input[i][j] : max;
    }
  }

  return max;
}
/**
 * Generate nSamples many integers from 0 to poolSize such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */

function rejectionSample(nSamples, poolSize, random) {
  var result = zeros(nSamples);

  for (var i = 0; i < nSamples; i++) {
    var rejectSample = true;

    while (rejectSample) {
      var j = tauRandInt(poolSize, random);
      var broken = false;

      for (var k = 0; k < i; k++) {
        if (j === result[k]) {
          broken = true;
          break;
        }
      }

      if (!broken) {
        rejectSample = false;
      }

      result[i] = j;
    }
  }

  return result;
}
/**
 * Reshapes a 1d array into a 2D of given dimensions.
 */

function reshape2d(x, a, b) {
  var rows = [];
  var count = 0;
  var index = 0;

  if (x.length !== a * b) {
    throw new Error('Array dimensions must match input length.');
  }

  for (var i = 0; i < a; i++) {
    var col = [];

    for (var j = 0; j < b; j++) {
      col.push(x[index]);
      index += 1;
    }

    rows.push(col);
    count += 1;
  }

  return rows;
}

/***/ }),

/***/ "./src/model/DistanceMetric.ts":
/*!*************************************!*\
  !*** ./src/model/DistanceMetric.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DistanceMetric": () => (/* binding */ DistanceMetric)
/* harmony export */ });
var DistanceMetric;

(function (DistanceMetric) {
  DistanceMetric["EUCLIDEAN"] = "euclidean";
  DistanceMetric["JACCARD"] = "jaccard";
  DistanceMetric["GOWER"] = "gower";
  DistanceMetric["COSINE"] = "cosine";
  DistanceMetric["MANHATTAN"] = "manhattan";
})(DistanceMetric || (DistanceMetric = {}));

/***/ }),

/***/ "./src/model/FeatureType.ts":
/*!**********************************!*\
  !*** ./src/model/FeatureType.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FeatureType": () => (/* binding */ FeatureType)
/* harmony export */ });
/**
 * The data type of a feature
 */
var FeatureType;

(function (FeatureType) {
  /**
   * Means all values have no other group they belong to
   */
  FeatureType["String"] = "String";
  /**
   * Means all values are real numbers e.g. 0.23, 0.13, 1, 2...
   */

  FeatureType["Quantitative"] = "Quantitative";
  /**
   * Means the values represent groups
   */

  FeatureType["Categorical"] = "Categorical";
  /**
   * Means all values are date timestamps
   */

  FeatureType["Date"] = "Date";
  /**
   * Means there exist only 2 groups (stricter than categorical)
   */

  FeatureType["Binary"] = "Binary";
  FeatureType["Ordinal"] = "Ordinal";
  /**
   * Means all values are arrays of other values.
   */

  FeatureType["Array"] = "Array";
})(FeatureType || (FeatureType = {}));

/***/ })

}]);
//# sourceMappingURL=src_components_Utility_DistanceFunctions_ts-src_components_Utility_UMAP_umap_ts.js.map