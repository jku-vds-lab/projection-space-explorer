/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/components/workers/embeddings/worker_umap.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/is-any-array/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/is-any-array/src/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const toString = Object.prototype.toString;

function isAnyArray(object) {
  return toString.call(object).endsWith('Array]');
}

module.exports = isAnyArray;


/***/ }),

/***/ "./node_modules/ml-array-max/lib-es6/index.js":
/*!****************************************************!*\
  !*** ./node_modules/ml-array-max/lib-es6/index.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/is-any-array/src/index.js");
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(is_any_array__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Computes the maximum of the given values
 * @param {Array<number>} input
 * @return {number}
 */

function max(input) {
  if (!is_any_array__WEBPACK_IMPORTED_MODULE_0___default()(input)) {
    throw new TypeError('input must be an array');
  }

  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var maxValue = input[0];

  for (var i = 1; i < input.length; i++) {
    if (input[i] > maxValue) maxValue = input[i];
  }

  return maxValue;
}

/* harmony default export */ __webpack_exports__["default"] = (max);


/***/ }),

/***/ "./node_modules/ml-array-min/lib-es6/index.js":
/*!****************************************************!*\
  !*** ./node_modules/ml-array-min/lib-es6/index.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/is-any-array/src/index.js");
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(is_any_array__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Computes the minimum of the given values
 * @param {Array<number>} input
 * @return {number}
 */

function min(input) {
  if (!is_any_array__WEBPACK_IMPORTED_MODULE_0___default()(input)) {
    throw new TypeError('input must be an array');
  }

  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var minValue = input[0];

  for (var i = 1; i < input.length; i++) {
    if (input[i] < minValue) minValue = input[i];
  }

  return minValue;
}

/* harmony default export */ __webpack_exports__["default"] = (min);


/***/ }),

/***/ "./node_modules/ml-array-rescale/lib-es6/index.js":
/*!********************************************************!*\
  !*** ./node_modules/ml-array-rescale/lib-es6/index.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/is-any-array/src/index.js");
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(is_any_array__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ml_array_max__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ml-array-max */ "./node_modules/ml-array-max/lib-es6/index.js");
/* harmony import */ var ml_array_min__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ml-array-min */ "./node_modules/ml-array-min/lib-es6/index.js");




/**
 *
 * @param {Array} input
 * @param {object} [options={}]
 * @param {Array} [options.output=[]] specify the output array, can be the input array for in place modification
 */

function rescale(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!is_any_array__WEBPACK_IMPORTED_MODULE_0___default()(input)) {
    throw new TypeError('input must be an array');
  } else if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var output;

  if (options.output !== undefined) {
    if (!is_any_array__WEBPACK_IMPORTED_MODULE_0___default()(options.output)) {
      throw new TypeError('output option must be an array if specified');
    }

    output = options.output;
  } else {
    output = new Array(input.length);
  }

  var currentMin = Object(ml_array_min__WEBPACK_IMPORTED_MODULE_2__["default"])(input);
  var currentMax = Object(ml_array_max__WEBPACK_IMPORTED_MODULE_1__["default"])(input);

  if (currentMin === currentMax) {
    throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
  }

  var _options$min = options.min,
      minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
      _options$max = options.max,
      maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

  if (minValue >= maxValue) {
    throw new RangeError('min option must be smaller than max option');
  }

  var factor = (maxValue - minValue) / (currentMax - currentMin);

  for (var i = 0; i < input.length; i++) {
    output[i] = (input[i] - currentMin) * factor + minValue;
  }

  return output;
}

/* harmony default export */ __webpack_exports__["default"] = (rescale);


/***/ }),

/***/ "./node_modules/ml-levenberg-marquardt/src/errorCalculation.js":
/*!*********************************************************************!*\
  !*** ./node_modules/ml-levenberg-marquardt/src/errorCalculation.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return errorCalculation; });
/**
 * Calculate current error
 * @ignore
 * @param {{x:Array<number>, y:Array<number>}} data - Array of points to fit in the format [x1, x2, ... ], [y1, y2, ... ]
 * @param {Array<number>} parameters - Array of current parameter values
 * @param {function} parameterizedFunction - The parameters and returns a function with the independent variable as a parameter
 * @return {number}
 */
function errorCalculation(
  data,
  parameters,
  parameterizedFunction
) {
  var error = 0;
  const func = parameterizedFunction(parameters);

  for (var i = 0; i < data.x.length; i++) {
    error += Math.abs(data.y[i] - func(data.x[i]));
  }

  return error;
}


/***/ }),

/***/ "./node_modules/ml-levenberg-marquardt/src/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/ml-levenberg-marquardt/src/index.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return levenbergMarquardt; });
/* harmony import */ var _errorCalculation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errorCalculation */ "./node_modules/ml-levenberg-marquardt/src/errorCalculation.js");
/* harmony import */ var _step__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./step */ "./node_modules/ml-levenberg-marquardt/src/step.js");



/**
 * Curve fitting algorithm
 * @param {{x:Array<number>, y:Array<number>}} data - Array of points to fit in the format [x1, x2, ... ], [y1, y2, ... ]
 * @param {function} parameterizedFunction - The parameters and returns a function with the independent variable as a parameter
 * @param {object} [options] - Options object
 * @param {number} [options.damping] - Levenberg-Marquardt parameter
 * @param {number} [options.gradientDifference = 10e-2] - Adjustment for decrease the damping parameter
 * @param {Array<number>} [options.minValues] - Minimum allowed values for parameters
 * @param {Array<number>} [options.maxValues] - Maximum allowed values for parameters
 * @param {Array<number>} [options.initialValues] - Array of initial parameter values
 * @param {number} [options.maxIterations = 100] - Maximum of allowed iterations
 * @param {number} [options.errorTolerance = 10e-3] - Minimum uncertainty allowed for each point
 * @return {{parameterValues: Array<number>, parameterError: number, iterations: number}}
 */
function levenbergMarquardt(
  data,
  parameterizedFunction,
  options = {}
) {
  let {
    maxIterations = 100,
    gradientDifference = 10e-2,
    damping = 0,
    errorTolerance = 10e-3,
    minValues,
    maxValues,
    initialValues
  } = options;

  if (damping <= 0) {
    throw new Error('The damping option must be a positive number');
  } else if (!data.x || !data.y) {
    throw new Error('The data parameter must have x and y elements');
  } else if (
    !Array.isArray(data.x) ||
    data.x.length < 2 ||
    !Array.isArray(data.y) ||
    data.y.length < 2
  ) {
    throw new Error(
      'The data parameter elements must be an array with more than 2 points'
    );
  } else if (data.x.length !== data.y.length) {
    throw new Error('The data parameter elements must have the same size');
  }

  var parameters =
    initialValues || new Array(parameterizedFunction.length).fill(1);
  let parLen = parameters.length;
  maxValues = maxValues || new Array(parLen).fill(Number.MAX_SAFE_INTEGER);
  minValues = minValues || new Array(parLen).fill(Number.MIN_SAFE_INTEGER);

  if (maxValues.length !== minValues.length) {
    throw new Error('minValues and maxValues must be the same size');
  }

  if (!Array.isArray(parameters)) {
    throw new Error('initialValues must be an array');
  }

  var error = Object(_errorCalculation__WEBPACK_IMPORTED_MODULE_0__["default"])(data, parameters, parameterizedFunction);

  var converged = error <= errorTolerance;

  for (
    var iteration = 0;
    iteration < maxIterations && !converged;
    iteration++
  ) {
    parameters = Object(_step__WEBPACK_IMPORTED_MODULE_1__["default"])(
      data,
      parameters,
      damping,
      gradientDifference,
      parameterizedFunction
    );

    for (let k = 0; k < parLen; k++) {
      parameters[k] = Math.min(
        Math.max(minValues[k], parameters[k]),
        maxValues[k]
      );
    }

    error = Object(_errorCalculation__WEBPACK_IMPORTED_MODULE_0__["default"])(data, parameters, parameterizedFunction);
    if (isNaN(error)) break;
    converged = error <= errorTolerance;
  }

  return {
    parameterValues: parameters,
    parameterError: error,
    iterations: iteration
  };
}


/***/ }),

/***/ "./node_modules/ml-levenberg-marquardt/src/step.js":
/*!*********************************************************!*\
  !*** ./node_modules/ml-levenberg-marquardt/src/step.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return step; });
/* harmony import */ var ml_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ml-matrix */ "./node_modules/ml-matrix/src/index.js");


/**
 * Difference of the matrix function over the parameters
 * @ignore
 * @param {{x:Array<number>, y:Array<number>}} data - Array of points to fit in the format [x1, x2, ... ], [y1, y2, ... ]
 * @param {Array<number>} evaluatedData - Array of previous evaluated function values
 * @param {Array<number>} params - Array of previous parameter values
 * @param {number} gradientDifference - Adjustment for decrease the damping parameter
 * @param {function} paramFunction - The parameters and returns a function with the independent variable as a parameter
 * @return {Matrix}
 */
function gradientFunction(
  data,
  evaluatedData,
  params,
  gradientDifference,
  paramFunction
) {
  const n = params.length;
  const m = data.x.length;

  var ans = new Array(n);

  for (var param = 0; param < n; param++) {
    ans[param] = new Array(m);
    var auxParams = params.concat();
    auxParams[param] += gradientDifference;
    var funcParam = paramFunction(auxParams);

    for (var point = 0; point < m; point++) {
      ans[param][point] = evaluatedData[point] - funcParam(data.x[point]);
    }
  }
  return new ml_matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix"](ans);
}

/**
 * Matrix function over the samples
 * @ignore
 * @param {{x:Array<number>, y:Array<number>}} data - Array of points to fit in the format [x1, x2, ... ], [y1, y2, ... ]
 * @param {Array<number>} evaluatedData - Array of previous evaluated function values
 * @return {Matrix}
 */
function matrixFunction(data, evaluatedData) {
  const m = data.x.length;

  var ans = new Array(m);

  for (var point = 0; point < m; point++) {
    ans[point] = [data.y[point] - evaluatedData[point]];
  }

  return new ml_matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix"](ans);
}

/**
 * Iteration for Levenberg-Marquardt
 * @ignore
 * @param {{x:Array<number>, y:Array<number>}} data - Array of points to fit in the format [x1, x2, ... ], [y1, y2, ... ]
 * @param {Array<number>} params - Array of previous parameter values
 * @param {number} damping - Levenberg-Marquardt parameter
 * @param {number} gradientDifference - Adjustment for decrease the damping parameter
 * @param {function} parameterizedFunction - The parameters and returns a function with the independent variable as a parameter
 * @return {Array<number>}
 */
function step(
  data,
  params,
  damping,
  gradientDifference,
  parameterizedFunction
) {
  var value = damping * gradientDifference * gradientDifference;
  var identity = ml_matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix"].eye(params.length, params.length, value);

  const func = parameterizedFunction(params);
  var evaluatedData = data.x.map((e) => func(e));

  var gradientFunc = gradientFunction(
    data,
    evaluatedData,
    params,
    gradientDifference,
    parameterizedFunction
  );
  var matrixFunc = matrixFunction(data, evaluatedData);
  var inverseMatrix = Object(ml_matrix__WEBPACK_IMPORTED_MODULE_0__["inverse"])(
    identity.add(gradientFunc.mmul(gradientFunc.transpose()))
  );

  params = new ml_matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix"]([params]);
  params = params.sub(
    inverseMatrix
      .mmul(gradientFunc)
      .mmul(matrixFunc)
      .mul(gradientDifference)
      .transpose()
  );

  return params.to1DArray();
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/abstractMatrix.js":
/*!******************************************************!*\
  !*** ./node_modules/ml-matrix/src/abstractMatrix.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AbstractMatrix; });
/* harmony import */ var ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ml-array-rescale */ "./node_modules/ml-array-rescale/lib-es6/index.js");
/* harmony import */ var _dc_lu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dc/lu */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _views_transpose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/transpose */ "./node_modules/ml-matrix/src/views/transpose.js");
/* harmony import */ var _views_row__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/row */ "./node_modules/ml-matrix/src/views/row.js");
/* harmony import */ var _views_sub__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/sub */ "./node_modules/ml-matrix/src/views/sub.js");
/* harmony import */ var _views_selection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/selection */ "./node_modules/ml-matrix/src/views/selection.js");
/* harmony import */ var _views_rowSelection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./views/rowSelection */ "./node_modules/ml-matrix/src/views/rowSelection.js");
/* harmony import */ var _views_columnSelection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./views/columnSelection */ "./node_modules/ml-matrix/src/views/columnSelection.js");
/* harmony import */ var _views_column__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/column */ "./node_modules/ml-matrix/src/views/column.js");
/* harmony import */ var _views_flipRow__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./views/flipRow */ "./node_modules/ml-matrix/src/views/flipRow.js");
/* harmony import */ var _views_flipColumn__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/flipColumn */ "./node_modules/ml-matrix/src/views/flipColumn.js");















function AbstractMatrix(superCtor) {
  if (superCtor === undefined) superCtor = Object;

  /**
   * Real matrix
   * @class Matrix
   * @param {number|Array|Matrix} nRows - Number of rows of the new matrix,
   * 2D array containing the data or Matrix instance to clone
   * @param {number} [nColumns] - Number of columns of the new matrix
   */
  class Matrix extends superCtor {
    static get [Symbol.species]() {
      return this;
    }

    /**
     * Constructs a Matrix with the chosen dimensions from a 1D array
     * @param {number} newRows - Number of rows
     * @param {number} newColumns - Number of columns
     * @param {Array} newData - A 1D array containing data for the matrix
     * @return {Matrix} - The new matrix
     */
    static from1DArray(newRows, newColumns, newData) {
      var length = newRows * newColumns;
      if (length !== newData.length) {
        throw new RangeError('Data length does not match given dimensions');
      }
      var newMatrix = new this(newRows, newColumns);
      for (var row = 0; row < newRows; row++) {
        for (var column = 0; column < newColumns; column++) {
          newMatrix.set(row, column, newData[row * newColumns + column]);
        }
      }
      return newMatrix;
    }

    /**
         * Creates a row vector, a matrix with only one row.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
    static rowVector(newData) {
      var vector = new this(1, newData.length);
      for (var i = 0; i < newData.length; i++) {
        vector.set(0, i, newData[i]);
      }
      return vector;
    }

    /**
         * Creates a column vector, a matrix with only one column.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
    static columnVector(newData) {
      var vector = new this(newData.length, 1);
      for (var i = 0; i < newData.length; i++) {
        vector.set(i, 0, newData[i]);
      }
      return vector;
    }

    /**
         * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
    static empty(rows, columns) {
      return new this(rows, columns);
    }

    /**
         * Creates a matrix with the given dimensions. Values will be set to zero.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
    static zeros(rows, columns) {
      return this.empty(rows, columns).fill(0);
    }

    /**
         * Creates a matrix with the given dimensions. Values will be set to one.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
    static ones(rows, columns) {
      return this.empty(rows, columns).fill(1);
    }

    /**
         * Creates a matrix with the given dimensions. Values will be randomly set.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
    static rand(rows, columns, rng) {
      if (rng === undefined) rng = Math.random;
      var matrix = this.empty(rows, columns);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          matrix.set(i, j, rng());
        }
      }
      return matrix;
    }

    /**
         * Creates a matrix with the given dimensions. Values will be random integers.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {number} [maxValue=1000] - Maximum value
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
    static randInt(rows, columns, maxValue, rng) {
      if (maxValue === undefined) maxValue = 1000;
      if (rng === undefined) rng = Math.random;
      var matrix = this.empty(rows, columns);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          var value = Math.floor(rng() * maxValue);
          matrix.set(i, j, value);
        }
      }
      return matrix;
    }

    /**
         * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
         * @param {number} rows - Number of rows
         * @param {number} [columns=rows] - Number of columns
         * @param {number} [value=1] - Value to fill the diagonal with
         * @return {Matrix} - The new identity matrix
         */
    static eye(rows, columns, value) {
      if (columns === undefined) columns = rows;
      if (value === undefined) value = 1;
      var min = Math.min(rows, columns);
      var matrix = this.zeros(rows, columns);
      for (var i = 0; i < min; i++) {
        matrix.set(i, i, value);
      }
      return matrix;
    }

    /**
         * Creates a diagonal matrix based on the given array.
         * @param {Array} data - Array containing the data for the diagonal
         * @param {number} [rows] - Number of rows (Default: data.length)
         * @param {number} [columns] - Number of columns (Default: rows)
         * @return {Matrix} - The new diagonal matrix
         */
    static diag(data, rows, columns) {
      var l = data.length;
      if (rows === undefined) rows = l;
      if (columns === undefined) columns = rows;
      var min = Math.min(l, rows, columns);
      var matrix = this.zeros(rows, columns);
      for (var i = 0; i < min; i++) {
        matrix.set(i, i, data[i]);
      }
      return matrix;
    }

    /**
         * Returns a matrix whose elements are the minimum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
    static min(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      var rows = matrix1.rows;
      var columns = matrix1.columns;
      var result = new this(rows, columns);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }
      return result;
    }

    /**
         * Returns a matrix whose elements are the maximum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
    static max(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      var rows = matrix1.rows;
      var columns = matrix1.columns;
      var result = new this(rows, columns);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }
      return result;
    }

    /**
         * Check that the provided value is a Matrix and tries to instantiate one if not
         * @param {*} value - The value to check
         * @return {Matrix}
         */
    static checkMatrix(value) {
      return Matrix.isMatrix(value) ? value : new this(value);
    }

    /**
         * Returns true if the argument is a Matrix, false otherwise
         * @param {*} value - The value to check
         * @return {boolean}
         */
    static isMatrix(value) {
      return (value != null) && (value.klass === 'Matrix');
    }

    /**
         * @prop {number} size - The number of elements in the matrix.
         */
    get size() {
      return this.rows * this.columns;
    }

    /**
         * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
         * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
         * @return {Matrix} this
         */
    apply(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }
      var ii = this.rows;
      var jj = this.columns;
      for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
          callback.call(this, i, j);
        }
      }
      return this;
    }

    /**
         * Returns a new 1D array filled row by row with the matrix values
         * @return {Array}
         */
    to1DArray() {
      var array = new Array(this.size);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          array[i * this.columns + j] = this.get(i, j);
        }
      }
      return array;
    }

    /**
         * Returns a 2D array containing a copy of the data
         * @return {Array}
         */
    to2DArray() {
      var copy = new Array(this.rows);
      for (var i = 0; i < this.rows; i++) {
        copy[i] = new Array(this.columns);
        for (var j = 0; j < this.columns; j++) {
          copy[i][j] = this.get(i, j);
        }
      }
      return copy;
    }

    /**
         * @return {boolean} true if the matrix has one row
         */
    isRowVector() {
      return this.rows === 1;
    }

    /**
         * @return {boolean} true if the matrix has one column
         */
    isColumnVector() {
      return this.columns === 1;
    }

    /**
         * @return {boolean} true if the matrix has one row or one column
         */
    isVector() {
      return (this.rows === 1) || (this.columns === 1);
    }

    /**
         * @return {boolean} true if the matrix has the same number of rows and columns
         */
    isSquare() {
      return this.rows === this.columns;
    }

    /**
         * @return {boolean} true if the matrix is square and has the same values on both sides of the diagonal
         */
    isSymmetric() {
      if (this.isSquare()) {
        for (var i = 0; i < this.rows; i++) {
          for (var j = 0; j <= i; j++) {
            if (this.get(i, j) !== this.get(j, i)) {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    }

    /**
          * @return true if the matrix is in echelon form
          */
    isEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isEchelonForm = true;
      let checked = false;
      while ((i < this.rows) && (isEchelonForm)) {
        j = 0;
        checked = false;
        while ((j < this.columns) && (checked === false)) {
          if (this.get(i, j) === 0) {
            j++;
          } else if ((this.get(i, j) === 1) && (j > previousColumn)) {
            checked = true;
            previousColumn = j;
          } else {
            isEchelonForm = false;
            checked = true;
          }
        }
        i++;
      }
      return isEchelonForm;
    }

    /**
             * @return true if the matrix is in reduced echelon form
             */
    isReducedEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isReducedEchelonForm = true;
      let checked = false;
      while ((i < this.rows) && (isReducedEchelonForm)) {
        j = 0;
        checked = false;
        while ((j < this.columns) && (checked === false)) {
          if (this.get(i, j) === 0) {
            j++;
          } else if ((this.get(i, j) === 1) && (j > previousColumn)) {
            checked = true;
            previousColumn = j;
          } else {
            isReducedEchelonForm = false;
            checked = true;
          }
        }
        for (let k = j + 1; k < this.rows; k++) {
          if (this.get(i, k) !== 0) {
            isReducedEchelonForm = false;
          }
        }
        i++;
      }
      return isReducedEchelonForm;
    }

    /**
         * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @param {number} value - The new value for the element
         * @return {Matrix} this
         */
    set(rowIndex, columnIndex, value) { // eslint-disable-line no-unused-vars
      throw new Error('set method is unimplemented');
    }

    /**
         * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @return {number}
         */
    get(rowIndex, columnIndex) { // eslint-disable-line no-unused-vars
      throw new Error('get method is unimplemented');
    }

    /**
         * Creates a new matrix that is a repetition of the current matrix. New matrix has rowRep times the number of
         * rows of the matrix, and colRep times the number of columns of the matrix
         * @param {number} rowRep - Number of times the rows should be repeated
         * @param {number} colRep - Number of times the columns should be re
         * @return {Matrix}
         * @example
         * var matrix = new Matrix([[1,2]]);
         * matrix.repeat(2); // [[1,2],[1,2]]
         */
    repeat(rowRep, colRep) {
      rowRep = rowRep || 1;
      colRep = colRep || 1;
      var matrix = new this.constructor[Symbol.species](this.rows * rowRep, this.columns * colRep);
      for (var i = 0; i < rowRep; i++) {
        for (var j = 0; j < colRep; j++) {
          matrix.setSubMatrix(this, this.rows * i, this.columns * j);
        }
      }
      return matrix;
    }

    /**
         * Fills the matrix with a given value. All elements will be set to this value.
         * @param {number} value - New value
         * @return {Matrix} this
         */
    fill(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, value);
        }
      }
      return this;
    }

    /**
         * Negates the matrix. All elements will be multiplied by (-1)
         * @return {Matrix} this
         */
    neg() {
      return this.mulS(-1);
    }

    /**
         * Returns a new array from the given row index
         * @param {number} index - Row index
         * @return {Array}
         */
    getRow(index) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, index);
      var row = new Array(this.columns);
      for (var i = 0; i < this.columns; i++) {
        row[i] = this.get(index, i);
      }
      return row;
    }

    /**
         * Returns a new row vector from the given row index
         * @param {number} index - Row index
         * @return {Matrix}
         */
    getRowVector(index) {
      return this.constructor.rowVector(this.getRow(index));
    }

    /**
         * Sets a row at the given index
         * @param {number} index - Row index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
    setRow(index, array) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, index);
      array = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowVector"])(this, array);
      for (var i = 0; i < this.columns; i++) {
        this.set(index, i, array[i]);
      }
      return this;
    }

    /**
         * Swaps two rows
         * @param {number} row1 - First row index
         * @param {number} row2 - Second row index
         * @return {Matrix} this
         */
    swapRows(row1, row2) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row1);
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row2);
      for (var i = 0; i < this.columns; i++) {
        var temp = this.get(row1, i);
        this.set(row1, i, this.get(row2, i));
        this.set(row2, i, temp);
      }
      return this;
    }

    /**
         * Returns a new array from the given column index
         * @param {number} index - Column index
         * @return {Array}
         */
    getColumn(index) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, index);
      var column = new Array(this.rows);
      for (var i = 0; i < this.rows; i++) {
        column[i] = this.get(i, index);
      }
      return column;
    }

    /**
         * Returns a new column vector from the given column index
         * @param {number} index - Column index
         * @return {Matrix}
         */
    getColumnVector(index) {
      return this.constructor.columnVector(this.getColumn(index));
    }

    /**
         * Sets a column at the given index
         * @param {number} index - Column index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
    setColumn(index, array) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, index);
      array = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnVector"])(this, array);
      for (var i = 0; i < this.rows; i++) {
        this.set(i, index, array[i]);
      }
      return this;
    }

    /**
         * Swaps two columns
         * @param {number} column1 - First column index
         * @param {number} column2 - Second column index
         * @return {Matrix} this
         */
    swapColumns(column1, column2) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column1);
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column2);
      for (var i = 0; i < this.rows; i++) {
        var temp = this.get(i, column1);
        this.set(i, column1, this.get(i, column2));
        this.set(i, column2, temp);
      }
      return this;
    }

    /**
         * Adds the values of a vector to each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    addRowVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[j]);
        }
      }
      return this;
    }

    /**
         * Subtracts the values of a vector from each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    subRowVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[j]);
        }
      }
      return this;
    }

    /**
         * Multiplies the values of a vector with each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    mulRowVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[j]);
        }
      }
      return this;
    }

    /**
         * Divides the values of each row by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    divRowVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[j]);
        }
      }
      return this;
    }

    /**
         * Adds the values of a vector to each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    addColumnVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[i]);
        }
      }
      return this;
    }

    /**
         * Subtracts the values of a vector from each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    subColumnVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[i]);
        }
      }
      return this;
    }

    /**
         * Multiplies the values of a vector with each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    mulColumnVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[i]);
        }
      }
      return this;
    }

    /**
         * Divides the values of each column by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
    divColumnVector(vector) {
      vector = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnVector"])(this, vector);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[i]);
        }
      }
      return this;
    }

    /**
         * Multiplies the values of a row with a scalar
         * @param {number} index - Row index
         * @param {number} value
         * @return {Matrix} this
         */
    mulRow(index, value) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, index);
      for (var i = 0; i < this.columns; i++) {
        this.set(index, i, this.get(index, i) * value);
      }
      return this;
    }

    /**
         * Multiplies the values of a column with a scalar
         * @param {number} index - Column index
         * @param {number} value
         * @return {Matrix} this
         */
    mulColumn(index, value) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, index);
      for (var i = 0; i < this.rows; i++) {
        this.set(i, index, this.get(i, index) * value);
      }
      return this;
    }

    /**
         * Returns the maximum value of the matrix
         * @return {number}
         */
    max() {
      var v = this.get(0, 0);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
          }
        }
      }
      return v;
    }

    /**
         * Returns the index of the maximum value
         * @return {Array}
         */
    maxIndex() {
      var v = this.get(0, 0);
      var idx = [0, 0];
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }
      return idx;
    }

    /**
         * Returns the minimum value of the matrix
         * @return {number}
         */
    min() {
      var v = this.get(0, 0);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
          }
        }
      }
      return v;
    }

    /**
         * Returns the index of the minimum value
         * @return {Array}
         */
    minIndex() {
      var v = this.get(0, 0);
      var idx = [0, 0];
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }
      return idx;
    }

    /**
         * Returns the maximum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
    maxRow(row) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row);
      var v = this.get(row, 0);
      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
        }
      }
      return v;
    }

    /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
    maxRowIndex(row) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row);
      var v = this.get(row, 0);
      var idx = [row, 0];
      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }
      return idx;
    }

    /**
         * Returns the minimum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
    minRow(row) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row);
      var v = this.get(row, 0);
      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
        }
      }
      return v;
    }

    /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
    minRowIndex(row) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row);
      var v = this.get(row, 0);
      var idx = [row, 0];
      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }
      return idx;
    }

    /**
         * Returns the maximum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
    maxColumn(column) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column);
      var v = this.get(0, column);
      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
        }
      }
      return v;
    }

    /**
         * Returns the index of the maximum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
    maxColumnIndex(column) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column);
      var v = this.get(0, column);
      var idx = [0, column];
      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }
      return idx;
    }

    /**
         * Returns the minimum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
    minColumn(column) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column);
      var v = this.get(0, column);
      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
        }
      }
      return v;
    }

    /**
         * Returns the index of the minimum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
    minColumnIndex(column) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column);
      var v = this.get(0, column);
      var idx = [0, column];
      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }
      return idx;
    }

    /**
         * Returns an array containing the diagonal values of the matrix
         * @return {Array}
         */
    diag() {
      var min = Math.min(this.rows, this.columns);
      var diag = new Array(min);
      for (var i = 0; i < min; i++) {
        diag[i] = this.get(i, i);
      }
      return diag;
    }

    /**
         * Returns the sum by the argument given, if no argument given,
         * it returns the sum of all elements of the matrix.
         * @param {string} by - sum by 'row' or 'column'.
         * @return {Matrix|number}
         */
    sum(by) {
      switch (by) {
        case 'row':
          return Object(_util__WEBPACK_IMPORTED_MODULE_3__["sumByRow"])(this);
        case 'column':
          return Object(_util__WEBPACK_IMPORTED_MODULE_3__["sumByColumn"])(this);
        default:
          return Object(_util__WEBPACK_IMPORTED_MODULE_3__["sumAll"])(this);
      }
    }

    /**
         * Returns the mean of all elements of the matrix
         * @return {number}
         */
    mean() {
      return this.sum() / this.size;
    }

    /**
         * Returns the product of all elements of the matrix
         * @return {number}
         */
    prod() {
      var prod = 1;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          prod *= this.get(i, j);
        }
      }
      return prod;
    }

    /**
         * Returns the norm of a matrix.
         * @param {string} type - "frobenius" (default) or "max" return resp. the Frobenius norm and the max norm.
         * @return {number}
         */
    norm(type = 'frobenius') {
      var result = 0;
      if (type === 'max') {
        return this.max();
      } else if (type === 'frobenius') {
        for (var i = 0; i < this.rows; i++) {
          for (var j = 0; j < this.columns; j++) {
            result = result + this.get(i, j) * this.get(i, j);
          }
        }
        return Math.sqrt(result);
      } else {
        throw new RangeError(`unknown norm type: ${type}`);
      }
    }

    /**
         * Computes the cumulative sum of the matrix elements (in place, row by row)
         * @return {Matrix} this
         */
    cumulativeSum() {
      var sum = 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          sum += this.get(i, j);
          this.set(i, j, sum);
        }
      }
      return this;
    }

    /**
         * Computes the dot (scalar) product between the matrix and another
         * @param {Matrix} vector2 vector
         * @return {number}
         */
    dot(vector2) {
      if (Matrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
      var vector1 = this.to1DArray();
      if (vector1.length !== vector2.length) {
        throw new RangeError('vectors do not have the same size');
      }
      var dot = 0;
      for (var i = 0; i < vector1.length; i++) {
        dot += vector1[i] * vector2[i];
      }
      return dot;
    }

    /**
         * Returns the matrix product between this and other
         * @param {Matrix} other
         * @return {Matrix}
         */
    mmul(other) {
      other = this.constructor.checkMatrix(other);
      if (this.columns !== other.rows) {
        // eslint-disable-next-line no-console
        console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
      }

      var m = this.rows;
      var n = this.columns;
      var p = other.columns;

      var result = new this.constructor[Symbol.species](m, p);

      var Bcolj = new Array(n);
      for (var j = 0; j < p; j++) {
        for (var k = 0; k < n; k++) {
          Bcolj[k] = other.get(k, j);
        }

        for (var i = 0; i < m; i++) {
          var s = 0;
          for (k = 0; k < n; k++) {
            s += this.get(i, k) * Bcolj[k];
          }

          result.set(i, j, s);
        }
      }
      return result;
    }

    strassen2x2(other) {
      var result = new this.constructor[Symbol.species](2, 2);
      const a11 = this.get(0, 0);
      const b11 = other.get(0, 0);
      const a12 = this.get(0, 1);
      const b12 = other.get(0, 1);
      const a21 = this.get(1, 0);
      const b21 = other.get(1, 0);
      const a22 = this.get(1, 1);
      const b22 = other.get(1, 1);

      // Compute intermediate values.
      const m1 = (a11 + a22) * (b11 + b22);
      const m2 = (a21 + a22) * b11;
      const m3 = a11 * (b12 - b22);
      const m4 = a22 * (b21 - b11);
      const m5 = (a11 + a12) * b22;
      const m6 = (a21 - a11) * (b11 + b12);
      const m7 = (a12 - a22) * (b21 + b22);

      // Combine intermediate values into the output.
      const c00 = m1 + m4 - m5 + m7;
      const c01 = m3 + m5;
      const c10 = m2 + m4;
      const c11 = m1 - m2 + m3 + m6;

      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      return result;
    }

    strassen3x3(other) {
      var result = new this.constructor[Symbol.species](3, 3);

      const a00 = this.get(0, 0);
      const a01 = this.get(0, 1);
      const a02 = this.get(0, 2);
      const a10 = this.get(1, 0);
      const a11 = this.get(1, 1);
      const a12 = this.get(1, 2);
      const a20 = this.get(2, 0);
      const a21 = this.get(2, 1);
      const a22 = this.get(2, 2);

      const b00 = other.get(0, 0);
      const b01 = other.get(0, 1);
      const b02 = other.get(0, 2);
      const b10 = other.get(1, 0);
      const b11 = other.get(1, 1);
      const b12 = other.get(1, 2);
      const b20 = other.get(2, 0);
      const b21 = other.get(2, 1);
      const b22 = other.get(2, 2);

      const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
      const m2 = (a00 - a10) * (-b01 + b11);
      const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
      const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
      const m5 = (a10 + a11) * (-b00 + b01);
      const m6 = a00 * b00;
      const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
      const m8 = (-a00 + a20) * (b02 - b12);
      const m9 = (a20 + a21) * (-b00 + b02);
      const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
      const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
      const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
      const m13 = (a02 - a22) * (b11 - b21);
      const m14 = a02 * b20;
      const m15 = (a21 + a22) * (-b20 + b21);
      const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
      const m17 = (a02 - a12) * (b12 - b22);
      const m18 = (a11 + a12) * (-b20 + b22);
      const m19 = a01 * b10;
      const m20 = a12 * b21;
      const m21 = a10 * b02;
      const m22 = a20 * b01;
      const m23 = a22 * b22;

      const c00 = m6 + m14 + m19;
      const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
      const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
      const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
      const c11 = m2 + m4 + m5 + m6 + m20;
      const c12 = m14 + m16 + m17 + m18 + m21;
      const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
      const c21 = m12 + m13 + m14 + m15 + m22;
      const c22 = m6 + m7 + m8 + m9 + m23;

      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(0, 2, c02);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      result.set(1, 2, c12);
      result.set(2, 0, c20);
      result.set(2, 1, c21);
      result.set(2, 2, c22);
      return result;
    }

    /**
         * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
         * @param {Matrix} y
         * @return {Matrix}
         */
    mmulStrassen(y) {
      var x = this.clone();
      var r1 = x.rows;
      var c1 = x.columns;
      var r2 = y.rows;
      var c2 = y.columns;
      if (c1 !== r2) {
        // eslint-disable-next-line no-console
        console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
      }

      // Put a matrix into the top left of a matrix of zeros.
      // `rows` and `cols` are the dimensions of the output matrix.
      function embed(mat, rows, cols) {
        var r = mat.rows;
        var c = mat.columns;
        if ((r === rows) && (c === cols)) {
          return mat;
        } else {
          var resultat = Matrix.zeros(rows, cols);
          resultat = resultat.setSubMatrix(mat, 0, 0);
          return resultat;
        }
      }


      // Make sure both matrices are the same size.
      // This is exclusively for simplicity:
      // this algorithm can be implemented with matrices of different sizes.

      var r = Math.max(r1, r2);
      var c = Math.max(c1, c2);
      x = embed(x, r, c);
      y = embed(y, r, c);

      // Our recursive multiplication function.
      function blockMult(a, b, rows, cols) {
        // For small matrices, resort to naive multiplication.
        if (rows <= 512 || cols <= 512) {
          return a.mmul(b); // a is equivalent to this
        }

        // Apply dynamic padding.
        if ((rows % 2 === 1) && (cols % 2 === 1)) {
          a = embed(a, rows + 1, cols + 1);
          b = embed(b, rows + 1, cols + 1);
        } else if (rows % 2 === 1) {
          a = embed(a, rows + 1, cols);
          b = embed(b, rows + 1, cols);
        } else if (cols % 2 === 1) {
          a = embed(a, rows, cols + 1);
          b = embed(b, rows, cols + 1);
        }

        var halfRows = parseInt(a.rows / 2, 10);
        var halfCols = parseInt(a.columns / 2, 10);
        // Subdivide input matrices.
        var a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
        var b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

        var a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
        var b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

        var a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
        var b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

        var a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
        var b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

        // Compute intermediate values.
        var m1 = blockMult(Matrix.add(a11, a22), Matrix.add(b11, b22), halfRows, halfCols);
        var m2 = blockMult(Matrix.add(a21, a22), b11, halfRows, halfCols);
        var m3 = blockMult(a11, Matrix.sub(b12, b22), halfRows, halfCols);
        var m4 = blockMult(a22, Matrix.sub(b21, b11), halfRows, halfCols);
        var m5 = blockMult(Matrix.add(a11, a12), b22, halfRows, halfCols);
        var m6 = blockMult(Matrix.sub(a21, a11), Matrix.add(b11, b12), halfRows, halfCols);
        var m7 = blockMult(Matrix.sub(a12, a22), Matrix.add(b21, b22), halfRows, halfCols);

        // Combine intermediate values into the output.
        var c11 = Matrix.add(m1, m4);
        c11.sub(m5);
        c11.add(m7);
        var c12 = Matrix.add(m3, m5);
        var c21 = Matrix.add(m2, m4);
        var c22 = Matrix.sub(m1, m2);
        c22.add(m3);
        c22.add(m6);

        // Crop output to the desired size (undo dynamic padding).
        var resultat = Matrix.zeros(2 * c11.rows, 2 * c11.columns);
        resultat = resultat.setSubMatrix(c11, 0, 0);
        resultat = resultat.setSubMatrix(c12, c11.rows, 0);
        resultat = resultat.setSubMatrix(c21, 0, c11.columns);
        resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
        return resultat.subMatrix(0, rows - 1, 0, cols - 1);
      }
      return blockMult(x, y, r, c);
    }

    /**
         * Returns a row-by-row scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The scaled matrix
         */
    scaleRows(min, max) {
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      if (min >= max) {
        throw new RangeError('min should be strictly smaller than max');
      }
      var newMatrix = this.constructor.empty(this.rows, this.columns);
      for (var i = 0; i < this.rows; i++) {
        var scaled = Object(ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__["default"])(this.getRow(i), { min, max });
        newMatrix.setRow(i, scaled);
      }
      return newMatrix;
    }

    /**
         * Returns a new column-by-column scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The new scaled matrix
         * @example
         * var matrix = new Matrix([[1,2],[-1,0]]);
         * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
         */
    scaleColumns(min, max) {
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      if (min >= max) {
        throw new RangeError('min should be strictly smaller than max');
      }
      var newMatrix = this.constructor.empty(this.rows, this.columns);
      for (var i = 0; i < this.columns; i++) {
        var scaled = Object(ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__["default"])(this.getColumn(i), {
          min: min,
          max: max
        });
        newMatrix.setColumn(i, scaled);
      }
      return newMatrix;
    }


    /**
         * Returns the Kronecker product (also known as tensor product) between this and other
         * See https://en.wikipedia.org/wiki/Kronecker_product
         * @param {Matrix} other
         * @return {Matrix}
         */
    kroneckerProduct(other) {
      other = this.constructor.checkMatrix(other);

      var m = this.rows;
      var n = this.columns;
      var p = other.rows;
      var q = other.columns;

      var result = new this.constructor[Symbol.species](m * p, n * q);
      for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
          for (var k = 0; k < p; k++) {
            for (var l = 0; l < q; l++) {
              result[p * i + k][q * j + l] = this.get(i, j) * other.get(k, l);
            }
          }
        }
      }
      return result;
    }

    /**
         * Transposes the matrix and returns a new one containing the result
         * @return {Matrix}
         */
    transpose() {
      var result = new this.constructor[Symbol.species](this.columns, this.rows);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          result.set(j, i, this.get(i, j));
        }
      }
      return result;
    }

    /**
         * Sorts the rows (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
    sortRows(compareFunction) {
      if (compareFunction === undefined) compareFunction = compareNumbers;
      for (var i = 0; i < this.rows; i++) {
        this.setRow(i, this.getRow(i).sort(compareFunction));
      }
      return this;
    }

    /**
         * Sorts the columns (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
    sortColumns(compareFunction) {
      if (compareFunction === undefined) compareFunction = compareNumbers;
      for (var i = 0; i < this.columns; i++) {
        this.setColumn(i, this.getColumn(i).sort(compareFunction));
      }
      return this;
    }

    /**
         * Returns a subset of the matrix
         * @param {number} startRow - First row index
         * @param {number} endRow - Last row index
         * @param {number} startColumn - First column index
         * @param {number} endColumn - Last column index
         * @return {Matrix}
         */
    subMatrix(startRow, endRow, startColumn, endColumn) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRange"])(this, startRow, endRow, startColumn, endColumn);
      var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, endColumn - startColumn + 1);
      for (var i = startRow; i <= endRow; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
          newMatrix[i - startRow][j - startColumn] = this.get(i, j);
        }
      }
      return newMatrix;
    }

    /**
         * Returns a subset of the matrix based on an array of row indices
         * @param {Array} indices - Array containing the row indices
         * @param {number} [startColumn = 0] - First column index
         * @param {number} [endColumn = this.columns-1] - Last column index
         * @return {Matrix}
         */
    subMatrixRow(indices, startColumn, endColumn) {
      if (startColumn === undefined) startColumn = 0;
      if (endColumn === undefined) endColumn = this.columns - 1;
      if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns)) {
        throw new RangeError('Argument out of range');
      }

      var newMatrix = new this.constructor[Symbol.species](indices.length, endColumn - startColumn + 1);
      for (var i = 0; i < indices.length; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
          if (indices[i] < 0 || indices[i] >= this.rows) {
            throw new RangeError(`Row index out of range: ${indices[i]}`);
          }
          newMatrix.set(i, j - startColumn, this.get(indices[i], j));
        }
      }
      return newMatrix;
    }

    /**
         * Returns a subset of the matrix based on an array of column indices
         * @param {Array} indices - Array containing the column indices
         * @param {number} [startRow = 0] - First row index
         * @param {number} [endRow = this.rows-1] - Last row index
         * @return {Matrix}
         */
    subMatrixColumn(indices, startRow, endRow) {
      if (startRow === undefined) startRow = 0;
      if (endRow === undefined) endRow = this.rows - 1;
      if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows)) {
        throw new RangeError('Argument out of range');
      }

      var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, indices.length);
      for (var i = 0; i < indices.length; i++) {
        for (var j = startRow; j <= endRow; j++) {
          if (indices[i] < 0 || indices[i] >= this.columns) {
            throw new RangeError(`Column index out of range: ${indices[i]}`);
          }
          newMatrix.set(j - startRow, i, this.get(j, indices[i]));
        }
      }
      return newMatrix;
    }

    /**
         * Set a part of the matrix to the given sub-matrix
         * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
         * @param {number} startRow - The index of the first row to set
         * @param {number} startColumn - The index of the first column to set
         * @return {Matrix}
         */
    setSubMatrix(matrix, startRow, startColumn) {
      matrix = this.constructor.checkMatrix(matrix);
      var endRow = startRow + matrix.rows - 1;
      var endColumn = startColumn + matrix.columns - 1;
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRange"])(this, startRow, endRow, startColumn, endColumn);
      for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.columns; j++) {
          this[startRow + i][startColumn + j] = matrix.get(i, j);
        }
      }
      return this;
    }

    /**
         * Return a new matrix based on a selection of rows and columns
         * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
         * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
         * @return {Matrix} The new matrix
         */
    selection(rowIndices, columnIndices) {
      var indices = Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkIndices"])(this, rowIndices, columnIndices);
      var newMatrix = new this.constructor[Symbol.species](rowIndices.length, columnIndices.length);
      for (var i = 0; i < indices.row.length; i++) {
        var rowIndex = indices.row[i];
        for (var j = 0; j < indices.column.length; j++) {
          var columnIndex = indices.column[j];
          newMatrix[i][j] = this.get(rowIndex, columnIndex);
        }
      }
      return newMatrix;
    }

    /**
         * Returns the trace of the matrix (sum of the diagonal elements)
         * @return {number}
         */
    trace() {
      var min = Math.min(this.rows, this.columns);
      var trace = 0;
      for (var i = 0; i < min; i++) {
        trace += this.get(i, i);
      }
      return trace;
    }

    /*
         Matrix views
         */

    /**
         * Returns a view of the transposition of the matrix
         * @return {MatrixTransposeView}
         */
    transposeView() {
      return new _views_transpose__WEBPACK_IMPORTED_MODULE_4__["default"](this);
    }

    /**
         * Returns a view of the row vector with the given index
         * @param {number} row - row index of the vector
         * @return {MatrixRowView}
         */
    rowView(row) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkRowIndex"])(this, row);
      return new _views_row__WEBPACK_IMPORTED_MODULE_5__["default"](this, row);
    }

    /**
         * Returns a view of the column vector with the given index
         * @param {number} column - column index of the vector
         * @return {MatrixColumnView}
         */
    columnView(column) {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["checkColumnIndex"])(this, column);
      return new _views_column__WEBPACK_IMPORTED_MODULE_10__["default"](this, column);
    }

    /**
         * Returns a view of the matrix flipped in the row axis
         * @return {MatrixFlipRowView}
         */
    flipRowView() {
      return new _views_flipRow__WEBPACK_IMPORTED_MODULE_11__["default"](this);
    }

    /**
         * Returns a view of the matrix flipped in the column axis
         * @return {MatrixFlipColumnView}
         */
    flipColumnView() {
      return new _views_flipColumn__WEBPACK_IMPORTED_MODULE_12__["default"](this);
    }

    /**
         * Returns a view of a submatrix giving the index boundaries
         * @param {number} startRow - first row index of the submatrix
         * @param {number} endRow - last row index of the submatrix
         * @param {number} startColumn - first column index of the submatrix
         * @param {number} endColumn - last column index of the submatrix
         * @return {MatrixSubView}
         */
    subMatrixView(startRow, endRow, startColumn, endColumn) {
      return new _views_sub__WEBPACK_IMPORTED_MODULE_6__["default"](this, startRow, endRow, startColumn, endColumn);
    }

    /**
         * Returns a view of the cross of the row indices and the column indices
         * @example
         * // resulting vector is [[2], [2]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).selectionView([0, 0], [1])
         * @param {Array<number>} rowIndices
         * @param {Array<number>} columnIndices
         * @return {MatrixSelectionView}
         */
    selectionView(rowIndices, columnIndices) {
      return new _views_selection__WEBPACK_IMPORTED_MODULE_7__["default"](this, rowIndices, columnIndices);
    }

    /**
         * Returns a view of the row indices
         * @example
         * // resulting vector is [[1,2,3], [1,2,3]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).rowSelectionView([0, 0])
         * @param {Array<number>} rowIndices
         * @return {MatrixRowSelectionView}
         */
    rowSelectionView(rowIndices) {
      return new _views_rowSelection__WEBPACK_IMPORTED_MODULE_8__["default"](this, rowIndices);
    }

    /**
         * Returns a view of the column indices
         * @example
         * // resulting vector is [[2, 2], [5, 5]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).columnSelectionView([1, 1])
         * @param {Array<number>} columnIndices
         * @return {MatrixColumnSelectionView}
         */
    columnSelectionView(columnIndices) {
      return new _views_columnSelection__WEBPACK_IMPORTED_MODULE_9__["default"](this, columnIndices);
    }


    /**
        * Calculates and returns the determinant of a matrix as a Number
        * @example
        *   new Matrix([[1,2,3], [4,5,6]]).det()
        * @return {number}
        */
    det() {
      if (this.isSquare()) {
        var a, b, c, d;
        if (this.columns === 2) {
          // 2 x 2 matrix
          a = this.get(0, 0);
          b = this.get(0, 1);
          c = this.get(1, 0);
          d = this.get(1, 1);

          return a * d - (b * c);
        } else if (this.columns === 3) {
          // 3 x 3 matrix
          var subMatrix0, subMatrix1, subMatrix2;
          subMatrix0 = this.selectionView([1, 2], [1, 2]);
          subMatrix1 = this.selectionView([1, 2], [0, 2]);
          subMatrix2 = this.selectionView([1, 2], [0, 1]);
          a = this.get(0, 0);
          b = this.get(0, 1);
          c = this.get(0, 2);

          return a * subMatrix0.det() - b * subMatrix1.det() + c * subMatrix2.det();
        } else {
          // general purpose determinant using the LU decomposition
          return new _dc_lu__WEBPACK_IMPORTED_MODULE_1__["default"](this).determinant;
        }
      } else {
        throw Error('Determinant can only be calculated for a square matrix.');
      }
    }

    /**
         * Returns inverse of a matrix if it exists or the pseudoinverse
         * @param {number} threshold - threshold for taking inverse of singular values (default = 1e-15)
         * @return {Matrix} the (pseudo)inverted matrix.
         */
    pseudoInverse(threshold) {
      if (threshold === undefined) threshold = Number.EPSILON;
      var svdSolution = new _dc_svd__WEBPACK_IMPORTED_MODULE_2__["default"](this, { autoTranspose: true });

      var U = svdSolution.leftSingularVectors;
      var V = svdSolution.rightSingularVectors;
      var s = svdSolution.diagonal;

      for (var i = 0; i < s.length; i++) {
        if (Math.abs(s[i]) > threshold) {
          s[i] = 1.0 / s[i];
        } else {
          s[i] = 0.0;
        }
      }

      // convert list to diagonal
      s = this.constructor[Symbol.species].diag(s);
      return V.mmul(s.mmul(U.transposeView()));
    }

    /**
         * Creates an exact and independent copy of the matrix
         * @return {Matrix}
         */
    clone() {
      var newMatrix = new this.constructor[Symbol.species](this.rows, this.columns);
      for (var row = 0; row < this.rows; row++) {
        for (var column = 0; column < this.columns; column++) {
          newMatrix.set(row, column, this.get(row, column));
        }
      }
      return newMatrix;
    }
  }

  Matrix.prototype.klass = 'Matrix';

  function compareNumbers(a, b) {
    return a - b;
  }

  /*
     Synonyms
     */

  Matrix.random = Matrix.rand;
  Matrix.diagonal = Matrix.diag;
  Matrix.prototype.diagonal = Matrix.prototype.diag;
  Matrix.identity = Matrix.eye;
  Matrix.prototype.negate = Matrix.prototype.neg;
  Matrix.prototype.tensorProduct = Matrix.prototype.kroneckerProduct;
  Matrix.prototype.determinant = Matrix.prototype.det;

  /*
     Add dynamically instance and static methods for mathematical operations
     */

  var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

  var inplaceOperatorScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% value);
        }
    }
    return this;
})
`;

  var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
        this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
    }
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% matrix.get(i, j));
        }
    }
    return this;
})
`;

  var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(value);
})
`;

  var inplaceMethod = `
(function %name%() {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j)));
        }
    }
    return this;
})
`;

  var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%();
})
`;

  var inplaceMethodWithArgs = `
(function %name%(%args%) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), %args%));
        }
    }
    return this;
})
`;

  var staticMethodWithArgs = `
(function %name%(matrix, %args%) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(%args%);
})
`;


  var inplaceMethodWithOneArgScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), value));
        }
    }
    return this;
})
`;
  var inplaceMethodWithOneArgMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
        this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
    }
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), matrix.get(i, j)));
        }
    }
    return this;
})
`;

  var inplaceMethodWithOneArg = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

  var staticMethodWithOneArg = staticMethodWithArgs;

  var operators = [
    // Arithmetic operators
    ['+', 'add'],
    ['-', 'sub', 'subtract'],
    ['*', 'mul', 'multiply'],
    ['/', 'div', 'divide'],
    ['%', 'mod', 'modulus'],
    // Bitwise operators
    ['&', 'and'],
    ['|', 'or'],
    ['^', 'xor'],
    ['<<', 'leftShift'],
    ['>>', 'signPropagatingRightShift'],
    ['>>>', 'rightShift', 'zeroFillRightShift']
  ];

  var i;
  var eval2 = eval; // eslint-disable-line no-eval
  for (var operator of operators) {
    var inplaceOp = eval2(fillTemplateFunction(inplaceOperator, { name: operator[1], op: operator[0] }));
    var inplaceOpS = eval2(fillTemplateFunction(inplaceOperatorScalar, { name: `${operator[1]}S`, op: operator[0] }));
    var inplaceOpM = eval2(fillTemplateFunction(inplaceOperatorMatrix, { name: `${operator[1]}M`, op: operator[0] }));
    var staticOp = eval2(fillTemplateFunction(staticOperator, { name: operator[1] }));
    for (i = 1; i < operator.length; i++) {
      Matrix.prototype[operator[i]] = inplaceOp;
      Matrix.prototype[`${operator[i]}S`] = inplaceOpS;
      Matrix.prototype[`${operator[i]}M`] = inplaceOpM;
      Matrix[operator[i]] = staticOp;
    }
  }

  var methods = [['~', 'not']];

  [
    'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
    'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
    'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
  ].forEach(function (mathMethod) {
    methods.push([`Math.${mathMethod}`, mathMethod]);
  });

  for (var method of methods) {
    var inplaceMeth = eval2(fillTemplateFunction(inplaceMethod, { name: method[1], method: method[0] }));
    var staticMeth = eval2(fillTemplateFunction(staticMethod, { name: method[1] }));
    for (i = 1; i < method.length; i++) {
      Matrix.prototype[method[i]] = inplaceMeth;
      Matrix[method[i]] = staticMeth;
    }
  }

  var methodsWithArgs = [['Math.pow', 1, 'pow']];

  for (var methodWithArg of methodsWithArgs) {
    var args = 'arg0';
    for (i = 1; i < methodWithArg[1]; i++) {
      args += `, arg${i}`;
    }
    if (methodWithArg[1] !== 1) {
      var inplaceMethWithArgs = eval2(fillTemplateFunction(inplaceMethodWithArgs, {
        name: methodWithArg[2],
        method: methodWithArg[0],
        args: args
      }));
      var staticMethWithArgs = eval2(fillTemplateFunction(staticMethodWithArgs, { name: methodWithArg[2], args: args }));
      for (i = 2; i < methodWithArg.length; i++) {
        Matrix.prototype[methodWithArg[i]] = inplaceMethWithArgs;
        Matrix[methodWithArg[i]] = staticMethWithArgs;
      }
    } else {
      var tmplVar = {
        name: methodWithArg[2],
        args: args,
        method: methodWithArg[0]
      };
      var inplaceMethod2 = eval2(fillTemplateFunction(inplaceMethodWithOneArg, tmplVar));
      var inplaceMethodS = eval2(fillTemplateFunction(inplaceMethodWithOneArgScalar, tmplVar));
      var inplaceMethodM = eval2(fillTemplateFunction(inplaceMethodWithOneArgMatrix, tmplVar));
      var staticMethod2 = eval2(fillTemplateFunction(staticMethodWithOneArg, tmplVar));
      for (i = 2; i < methodWithArg.length; i++) {
        Matrix.prototype[methodWithArg[i]] = inplaceMethod2;
        Matrix.prototype[`${methodWithArg[i]}M`] = inplaceMethodM;
        Matrix.prototype[`${methodWithArg[i]}S`] = inplaceMethodS;
        Matrix[methodWithArg[i]] = staticMethod2;
      }
    }
  }

  function fillTemplateFunction(template, values) {
    for (var value in values) {
      template = template.replace(new RegExp(`%${value}%`, 'g'), values[value]);
    }
    return template;
  }

  return Matrix;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/cholesky.js":
/*!***************************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/cholesky.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CholeskyDecomposition; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./node_modules/ml-matrix/src/index.js");


/**
 * @class CholeskyDecomposition
 * @link https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
 * @param {Matrix} value
 */
class CholeskyDecomposition {
  constructor(value) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(value);
    if (!value.isSymmetric()) {
      throw new Error('Matrix is not symmetric');
    }

    var a = value;
    var dimension = a.rows;
    var l = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](dimension, dimension);
    var positiveDefinite = true;
    var i, j, k;

    for (j = 0; j < dimension; j++) {
      var Lrowj = l[j];
      var d = 0;
      for (k = 0; k < j; k++) {
        var Lrowk = l[k];
        var s = 0;
        for (i = 0; i < k; i++) {
          s += Lrowk[i] * Lrowj[i];
        }
        Lrowj[k] = s = (a.get(j, k) - s) / l[k][k];
        d = d + s * s;
      }

      d = a.get(j, j) - d;

      positiveDefinite &= d > 0;
      l[j][j] = Math.sqrt(Math.max(d, 0));
      for (k = j + 1; k < dimension; k++) {
        l[j][k] = 0;
      }
    }

    if (!positiveDefinite) {
      throw new Error('Matrix is not positive definite');
    }

    this.L = l;
  }

  /**
   *
   * @param {Matrix} value
   * @return {Matrix}
   */
  solve(value) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(value);

    var l = this.L;
    var dimension = l.rows;

    if (value.rows !== dimension) {
      throw new Error('Matrix dimensions do not match');
    }

    var count = value.columns;
    var B = value.clone();
    var i, j, k;

    for (k = 0; k < dimension; k++) {
      for (j = 0; j < count; j++) {
        for (i = 0; i < k; i++) {
          B[k][j] -= B[i][j] * l[k][i];
        }
        B[k][j] /= l[k][k];
      }
    }

    for (k = dimension - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        for (i = k + 1; i < dimension; i++) {
          B[k][j] -= B[i][j] * l[i][k];
        }
        B[k][j] /= l[k][k];
      }
    }

    return B;
  }

  /**
   *
   * @return {Matrix}
   */
  get lowerTriangularMatrix() {
    return this.L;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/evd.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/evd.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EigenvalueDecomposition; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./node_modules/ml-matrix/src/index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");




/**
 * @class EigenvalueDecomposition
 * @link https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
 * @param {Matrix} matrix
 * @param {object} [options]
 * @param {boolean} [options.assumeSymmetric=false]
 */
class EigenvalueDecomposition {
  constructor(matrix, options = {}) {
    const { assumeSymmetric = false } = options;

    matrix = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(matrix);
    if (!matrix.isSquare()) {
      throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns;
    var V = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getFilled2DArray"])(n, n, 0);
    var d = new Array(n);
    var e = new Array(n);
    var value = matrix;
    var i, j;

    var isSymmetric = false;
    if (assumeSymmetric) {
      isSymmetric = true;
    } else {
      isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          V[i][j] = value.get(i, j);
        }
      }
      tred2(n, e, d, V);
      tql2(n, e, d, V);
    } else {
      var H = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getFilled2DArray"])(n, n, 0);
      var ort = new Array(n);
      for (j = 0; j < n; j++) {
        for (i = 0; i < n; i++) {
          H[i][j] = value.get(i, j);
        }
      }
      orthes(n, H, ort, V);
      hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
  }

  /**
   *
   * @return {Array<number>}
   */
  get realEigenvalues() {
    return this.d;
  }

  /**
   *
   * @return {Array<number>}
   */
  get imaginaryEigenvalues() {
    return this.e;
  }

  /**
   *
   * @return {Matrix}
   */
  get eigenvectorMatrix() {
    if (!_index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].isMatrix(this.V)) {
      this.V = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](this.V);
    }
    return this.V;
  }

  /**
   *
   * @return {Matrix}
   */
  get diagonalMatrix() {
    var n = this.n;
    var e = this.e;
    var d = this.d;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](n, n);
    var i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        X[i][j] = 0;
      }
      X[i][i] = d[i];
      if (e[i] > 0) {
        X[i][i + 1] = e[i];
      } else if (e[i] < 0) {
        X[i][i - 1] = e[i];
      }
    }
    return X;
  }
}

function tred2(n, e, d, V) {
  var f, g, h, i, j, k, hh, scale;

  for (j = 0; j < n; j++) {
    d[j] = V[n - 1][j];
  }

  for (i = n - 1; i > 0; i--) {
    scale = 0;
    h = 0;
    for (k = 0; k < i; k++) {
      scale = scale + Math.abs(d[k]);
    }

    if (scale === 0) {
      e[i] = d[i - 1];
      for (j = 0; j < i; j++) {
        d[j] = V[i - 1][j];
        V[i][j] = 0;
        V[j][i] = 0;
      }
    } else {
      for (k = 0; k < i; k++) {
        d[k] /= scale;
        h += d[k] * d[k];
      }

      f = d[i - 1];
      g = Math.sqrt(h);
      if (f > 0) {
        g = -g;
      }

      e[i] = scale * g;
      h = h - f * g;
      d[i - 1] = f - g;
      for (j = 0; j < i; j++) {
        e[j] = 0;
      }

      for (j = 0; j < i; j++) {
        f = d[j];
        V[j][i] = f;
        g = e[j] + V[j][j] * f;
        for (k = j + 1; k <= i - 1; k++) {
          g += V[k][j] * d[k];
          e[k] += V[k][j] * f;
        }
        e[j] = g;
      }

      f = 0;
      for (j = 0; j < i; j++) {
        e[j] /= h;
        f += e[j] * d[j];
      }

      hh = f / (h + h);
      for (j = 0; j < i; j++) {
        e[j] -= hh * d[j];
      }

      for (j = 0; j < i; j++) {
        f = d[j];
        g = e[j];
        for (k = j; k <= i - 1; k++) {
          V[k][j] -= f * e[k] + g * d[k];
        }
        d[j] = V[i - 1][j];
        V[i][j] = 0;
      }
    }
    d[i] = h;
  }

  for (i = 0; i < n - 1; i++) {
    V[n - 1][i] = V[i][i];
    V[i][i] = 1;
    h = d[i + 1];
    if (h !== 0) {
      for (k = 0; k <= i; k++) {
        d[k] = V[k][i + 1] / h;
      }

      for (j = 0; j <= i; j++) {
        g = 0;
        for (k = 0; k <= i; k++) {
          g += V[k][i + 1] * V[k][j];
        }
        for (k = 0; k <= i; k++) {
          V[k][j] -= g * d[k];
        }
      }
    }

    for (k = 0; k <= i; k++) {
      V[k][i + 1] = 0;
    }
  }

  for (j = 0; j < n; j++) {
    d[j] = V[n - 1][j];
    V[n - 1][j] = 0;
  }

  V[n - 1][n - 1] = 1;
  e[0] = 0;
}

function tql2(n, e, d, V) {
  var g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2, iter;

  for (i = 1; i < n; i++) {
    e[i - 1] = e[i];
  }

  e[n - 1] = 0;

  var f = 0;
  var tst1 = 0;
  var eps = Number.EPSILON;

  for (l = 0; l < n; l++) {
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    m = l;
    while (m < n) {
      if (Math.abs(e[m]) <= eps * tst1) {
        break;
      }
      m++;
    }

    if (m > l) {
      iter = 0;
      do {
        iter = iter + 1;

        g = d[l];
        p = (d[l + 1] - g) / (2 * e[l]);
        r = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(p, 1);
        if (p < 0) {
          r = -r;
        }

        d[l] = e[l] / (p + r);
        d[l + 1] = e[l] * (p + r);
        dl1 = d[l + 1];
        h = g - d[l];
        for (i = l + 2; i < n; i++) {
          d[i] -= h;
        }

        f = f + h;

        p = d[m];
        c = 1;
        c2 = c;
        c3 = c;
        el1 = e[l + 1];
        s = 0;
        s2 = 0;
        for (i = m - 1; i >= l; i--) {
          c3 = c2;
          c2 = c;
          s2 = s;
          g = c * e[i];
          h = c * p;
          r = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(p, e[i]);
          e[i + 1] = s * r;
          s = e[i] / r;
          c = p / r;
          p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);

          for (k = 0; k < n; k++) {
            h = V[k][i + 1];
            V[k][i + 1] = s * V[k][i] + c * h;
            V[k][i] = c * V[k][i] - s * h;
          }
        }

        p = -s * s2 * c3 * el1 * e[l] / dl1;
        e[l] = s * p;
        d[l] = c * p;
      } while (Math.abs(e[l]) > eps * tst1);
    }
    d[l] = d[l] + f;
    e[l] = 0;
  }

  for (i = 0; i < n - 1; i++) {
    k = i;
    p = d[i];
    for (j = i + 1; j < n; j++) {
      if (d[j] < p) {
        k = j;
        p = d[j];
      }
    }

    if (k !== i) {
      d[k] = d[i];
      d[i] = p;
      for (j = 0; j < n; j++) {
        p = V[j][i];
        V[j][i] = V[j][k];
        V[j][k] = p;
      }
    }
  }
}

function orthes(n, H, ort, V) {
  var low = 0;
  var high = n - 1;
  var f, g, h, i, j, m;
  var scale;

  for (m = low + 1; m <= high - 1; m++) {
    scale = 0;
    for (i = m; i <= high; i++) {
      scale = scale + Math.abs(H[i][m - 1]);
    }

    if (scale !== 0) {
      h = 0;
      for (i = high; i >= m; i--) {
        ort[i] = H[i][m - 1] / scale;
        h += ort[i] * ort[i];
      }

      g = Math.sqrt(h);
      if (ort[m] > 0) {
        g = -g;
      }

      h = h - ort[m] * g;
      ort[m] = ort[m] - g;

      for (j = m; j < n; j++) {
        f = 0;
        for (i = high; i >= m; i--) {
          f += ort[i] * H[i][j];
        }

        f = f / h;
        for (i = m; i <= high; i++) {
          H[i][j] -= f * ort[i];
        }
      }

      for (i = 0; i <= high; i++) {
        f = 0;
        for (j = high; j >= m; j--) {
          f += ort[j] * H[i][j];
        }

        f = f / h;
        for (j = m; j <= high; j++) {
          H[i][j] -= f * ort[j];
        }
      }

      ort[m] = scale * ort[m];
      H[m][m - 1] = scale * g;
    }
  }

  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      V[i][j] = i === j ? 1 : 0;
    }
  }

  for (m = high - 1; m >= low + 1; m--) {
    if (H[m][m - 1] !== 0) {
      for (i = m + 1; i <= high; i++) {
        ort[i] = H[i][m - 1];
      }

      for (j = m; j <= high; j++) {
        g = 0;
        for (i = m; i <= high; i++) {
          g += ort[i] * V[i][j];
        }

        g = g / ort[m] / H[m][m - 1];
        for (i = m; i <= high; i++) {
          V[i][j] += g * ort[i];
        }
      }
    }
  }
}

function hqr2(nn, e, d, V, H) {
  var n = nn - 1;
  var low = 0;
  var high = nn - 1;
  var eps = Number.EPSILON;
  var exshift = 0;
  var norm = 0;
  var p = 0;
  var q = 0;
  var r = 0;
  var s = 0;
  var z = 0;
  var iter = 0;
  var i, j, k, l, m, t, w, x, y;
  var ra, sa, vr, vi;
  var notlast, cdivres;

  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      d[i] = H[i][i];
      e[i] = 0;
    }

    for (j = Math.max(i - 1, 0); j < nn; j++) {
      norm = norm + Math.abs(H[i][j]);
    }
  }

  while (n >= low) {
    l = n;
    while (l > low) {
      s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
      if (s === 0) {
        s = norm;
      }
      if (Math.abs(H[l][l - 1]) < eps * s) {
        break;
      }
      l--;
    }

    if (l === n) {
      H[n][n] = H[n][n] + exshift;
      d[n] = H[n][n];
      e[n] = 0;
      n--;
      iter = 0;
    } else if (l === n - 1) {
      w = H[n][n - 1] * H[n - 1][n];
      p = (H[n - 1][n - 1] - H[n][n]) / 2;
      q = p * p + w;
      z = Math.sqrt(Math.abs(q));
      H[n][n] = H[n][n] + exshift;
      H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
      x = H[n][n];

      if (q >= 0) {
        z = p >= 0 ? p + z : p - z;
        d[n - 1] = x + z;
        d[n] = d[n - 1];
        if (z !== 0) {
          d[n] = x - w / z;
        }
        e[n - 1] = 0;
        e[n] = 0;
        x = H[n][n - 1];
        s = Math.abs(x) + Math.abs(z);
        p = x / s;
        q = z / s;
        r = Math.sqrt(p * p + q * q);
        p = p / r;
        q = q / r;

        for (j = n - 1; j < nn; j++) {
          z = H[n - 1][j];
          H[n - 1][j] = q * z + p * H[n][j];
          H[n][j] = q * H[n][j] - p * z;
        }

        for (i = 0; i <= n; i++) {
          z = H[i][n - 1];
          H[i][n - 1] = q * z + p * H[i][n];
          H[i][n] = q * H[i][n] - p * z;
        }

        for (i = low; i <= high; i++) {
          z = V[i][n - 1];
          V[i][n - 1] = q * z + p * V[i][n];
          V[i][n] = q * V[i][n] - p * z;
        }
      } else {
        d[n - 1] = x + p;
        d[n] = x + p;
        e[n - 1] = z;
        e[n] = -z;
      }

      n = n - 2;
      iter = 0;
    } else {
      x = H[n][n];
      y = 0;
      w = 0;
      if (l < n) {
        y = H[n - 1][n - 1];
        w = H[n][n - 1] * H[n - 1][n];
      }

      if (iter === 10) {
        exshift += x;
        for (i = low; i <= n; i++) {
          H[i][i] -= x;
        }
        s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
        x = y = 0.75 * s;
        w = -0.4375 * s * s;
      }

      if (iter === 30) {
        s = (y - x) / 2;
        s = s * s + w;
        if (s > 0) {
          s = Math.sqrt(s);
          if (y < x) {
            s = -s;
          }
          s = x - w / ((y - x) / 2 + s);
          for (i = low; i <= n; i++) {
            H[i][i] -= s;
          }
          exshift += s;
          x = y = w = 0.964;
        }
      }

      iter = iter + 1;

      m = n - 2;
      while (m >= l) {
        z = H[m][m];
        r = x - z;
        s = y - z;
        p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
        q = H[m + 1][m + 1] - z - r - s;
        r = H[m + 2][m + 1];
        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
        p = p / s;
        q = q / s;
        r = r / s;
        if (m === l) {
          break;
        }
        if (
          Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) <
          eps *
            (Math.abs(p) *
              (Math.abs(H[m - 1][m - 1]) +
                Math.abs(z) +
                Math.abs(H[m + 1][m + 1])))
        ) {
          break;
        }
        m--;
      }

      for (i = m + 2; i <= n; i++) {
        H[i][i - 2] = 0;
        if (i > m + 2) {
          H[i][i - 3] = 0;
        }
      }

      for (k = m; k <= n - 1; k++) {
        notlast = k !== n - 1;
        if (k !== m) {
          p = H[k][k - 1];
          q = H[k + 1][k - 1];
          r = notlast ? H[k + 2][k - 1] : 0;
          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
          if (x !== 0) {
            p = p / x;
            q = q / x;
            r = r / x;
          }
        }

        if (x === 0) {
          break;
        }

        s = Math.sqrt(p * p + q * q + r * r);
        if (p < 0) {
          s = -s;
        }

        if (s !== 0) {
          if (k !== m) {
            H[k][k - 1] = -s * x;
          } else if (l !== m) {
            H[k][k - 1] = -H[k][k - 1];
          }

          p = p + s;
          x = p / s;
          y = q / s;
          z = r / s;
          q = q / p;
          r = r / p;

          for (j = k; j < nn; j++) {
            p = H[k][j] + q * H[k + 1][j];
            if (notlast) {
              p = p + r * H[k + 2][j];
              H[k + 2][j] = H[k + 2][j] - p * z;
            }

            H[k][j] = H[k][j] - p * x;
            H[k + 1][j] = H[k + 1][j] - p * y;
          }

          for (i = 0; i <= Math.min(n, k + 3); i++) {
            p = x * H[i][k] + y * H[i][k + 1];
            if (notlast) {
              p = p + z * H[i][k + 2];
              H[i][k + 2] = H[i][k + 2] - p * r;
            }

            H[i][k] = H[i][k] - p;
            H[i][k + 1] = H[i][k + 1] - p * q;
          }

          for (i = low; i <= high; i++) {
            p = x * V[i][k] + y * V[i][k + 1];
            if (notlast) {
              p = p + z * V[i][k + 2];
              V[i][k + 2] = V[i][k + 2] - p * r;
            }

            V[i][k] = V[i][k] - p;
            V[i][k + 1] = V[i][k + 1] - p * q;
          }
        }
      }
    }
  }

  if (norm === 0) {
    return;
  }

  for (n = nn - 1; n >= 0; n--) {
    p = d[n];
    q = e[n];

    if (q === 0) {
      l = n;
      H[n][n] = 1;
      for (i = n - 1; i >= 0; i--) {
        w = H[i][i] - p;
        r = 0;
        for (j = l; j <= n; j++) {
          r = r + H[i][j] * H[j][n];
        }

        if (e[i] < 0) {
          z = w;
          s = r;
        } else {
          l = i;
          if (e[i] === 0) {
            H[i][n] = w !== 0 ? -r / w : -r / (eps * norm);
          } else {
            x = H[i][i + 1];
            y = H[i + 1][i];
            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
            t = (x * s - z * r) / q;
            H[i][n] = t;
            H[i + 1][n] =
              Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z;
          }

          t = Math.abs(H[i][n]);
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H[j][n] = H[j][n] / t;
            }
          }
        }
      }
    } else if (q < 0) {
      l = n - 1;

      if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
        H[n - 1][n - 1] = q / H[n][n - 1];
        H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
      } else {
        cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
        H[n - 1][n - 1] = cdivres[0];
        H[n - 1][n] = cdivres[1];
      }

      H[n][n - 1] = 0;
      H[n][n] = 1;
      for (i = n - 2; i >= 0; i--) {
        ra = 0;
        sa = 0;
        for (j = l; j <= n; j++) {
          ra = ra + H[i][j] * H[j][n - 1];
          sa = sa + H[i][j] * H[j][n];
        }

        w = H[i][i] - p;

        if (e[i] < 0) {
          z = w;
          r = ra;
          s = sa;
        } else {
          l = i;
          if (e[i] === 0) {
            cdivres = cdiv(-ra, -sa, w, q);
            H[i][n - 1] = cdivres[0];
            H[i][n] = cdivres[1];
          } else {
            x = H[i][i + 1];
            y = H[i + 1][i];
            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
            vi = (d[i] - p) * 2 * q;
            if (vr === 0 && vi === 0) {
              vr =
                eps *
                norm *
                (Math.abs(w) +
                  Math.abs(q) +
                  Math.abs(x) +
                  Math.abs(y) +
                  Math.abs(z));
            }
            cdivres = cdiv(
              x * r - z * ra + q * sa,
              x * s - z * sa - q * ra,
              vr,
              vi
            );
            H[i][n - 1] = cdivres[0];
            H[i][n] = cdivres[1];
            if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
              H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
              H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
            } else {
              cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
              H[i + 1][n - 1] = cdivres[0];
              H[i + 1][n] = cdivres[1];
            }
          }

          t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H[j][n - 1] = H[j][n - 1] / t;
              H[j][n] = H[j][n] / t;
            }
          }
        }
      }
    }
  }

  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      for (j = i; j < nn; j++) {
        V[i][j] = H[i][j];
      }
    }
  }

  for (j = nn - 1; j >= low; j--) {
    for (i = low; i <= high; i++) {
      z = 0;
      for (k = low; k <= Math.min(j, high); k++) {
        z = z + V[i][k] * H[k][j];
      }
      V[i][j] = z;
    }
  }
}

function cdiv(xr, xi, yr, yi) {
  var r, d;
  if (Math.abs(yr) > Math.abs(yi)) {
    r = yi / yr;
    d = yr + r * yi;
    return [(xr + r * xi) / d, (xi - r * xr) / d];
  } else {
    r = yr / yi;
    d = yi + r * yr;
    return [(r * xr + xi) / d, (r * xi - xr) / d];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/lu.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/lu.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LuDecomposition; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./node_modules/ml-matrix/src/index.js");


/**
 * @class LuDecomposition
 * @link https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
 * @param {Matrix} matrix
 */
class LuDecomposition {
  constructor(matrix) {
    matrix = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(matrix);

    var lu = matrix.clone();
    var rows = lu.rows;
    var columns = lu.columns;
    var pivotVector = new Array(rows);
    var pivotSign = 1;
    var i, j, k, p, s, t, v;
    var LUcolj, kmax;

    for (i = 0; i < rows; i++) {
      pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {
      for (i = 0; i < rows; i++) {
        LUcolj[i] = lu.get(i, j);
      }

      for (i = 0; i < rows; i++) {
        kmax = Math.min(i, j);
        s = 0;
        for (k = 0; k < kmax; k++) {
          s += lu.get(i, k) * LUcolj[k];
        }
        LUcolj[i] -= s;
        lu.set(i, j, LUcolj[i]);
      }

      p = j;
      for (i = j + 1; i < rows; i++) {
        if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
          p = i;
        }
      }

      if (p !== j) {
        for (k = 0; k < columns; k++) {
          t = lu.get(p, k);
          lu.set(p, k, lu.get(j, k));
          lu.set(j, k, t);
        }

        v = pivotVector[p];
        pivotVector[p] = pivotVector[j];
        pivotVector[j] = v;

        pivotSign = -pivotSign;
      }

      if (j < rows && lu.get(j, j) !== 0) {
        for (i = j + 1; i < rows; i++) {
          lu.set(i, j, lu.get(i, j) / lu.get(j, j));
        }
      }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
  }

  /**
   *
   * @return {boolean}
   */
  isSingular() {
    var data = this.LU;
    var col = data.columns;
    for (var j = 0; j < col; j++) {
      if (data[j][j] === 0) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {Matrix} value
   * @return {Matrix}
   */
  solve(value) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].checkMatrix(value);

    var lu = this.LU;
    var rows = lu.rows;

    if (rows !== value.rows) {
      throw new Error('Invalid matrix dimensions');
    }
    if (this.isSingular()) {
      throw new Error('LU matrix is singular');
    }

    var count = value.columns;
    var X = value.subMatrixRow(this.pivotVector, 0, count - 1);
    var columns = lu.columns;
    var i, j, k;

    for (k = 0; k < columns; k++) {
      for (i = k + 1; i < columns; i++) {
        for (j = 0; j < count; j++) {
          X[i][j] -= X[k][j] * lu[i][k];
        }
      }
    }
    for (k = columns - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X[k][j] /= lu[k][k];
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X[i][j] -= X[k][j] * lu[i][k];
        }
      }
    }
    return X;
  }

  /**
   *
   * @return {number}
   */
  get determinant() {
    var data = this.LU;
    if (!data.isSquare()) {
      throw new Error('Matrix must be square');
    }
    var determinant = this.pivotSign;
    var col = data.columns;
    for (var j = 0; j < col; j++) {
      determinant *= data[j][j];
    }
    return determinant;
  }

  /**
   *
   * @return {Matrix}
   */
  get lowerTriangularMatrix() {
    var data = this.LU;
    var rows = data.rows;
    var columns = data.columns;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](rows, columns);
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        if (i > j) {
          X[i][j] = data[i][j];
        } else if (i === j) {
          X[i][j] = 1;
        } else {
          X[i][j] = 0;
        }
      }
    }
    return X;
  }

  /**
   *
   * @return {Matrix}
   */
  get upperTriangularMatrix() {
    var data = this.LU;
    var rows = data.rows;
    var columns = data.columns;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](rows, columns);
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        if (i <= j) {
          X[i][j] = data[i][j];
        } else {
          X[i][j] = 0;
        }
      }
    }
    return X;
  }

  /**
   *
   * @return {Array<number>}
   */
  get pivotPermutationVector() {
    return this.pivotVector.slice();
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/qr.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/qr.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QrDecomposition; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./node_modules/ml-matrix/src/index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");




/**
 * @class QrDecomposition
 * @link https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
 * @param {Matrix} value
 */
class QrDecomposition {
  constructor(value) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(value);

    var qr = value.clone();
    var m = value.rows;
    var n = value.columns;
    var rdiag = new Array(n);
    var i, j, k, s;

    for (k = 0; k < n; k++) {
      var nrm = 0;
      for (i = k; i < m; i++) {
        nrm = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(nrm, qr.get(i, k));
      }
      if (nrm !== 0) {
        if (qr.get(k, k) < 0) {
          nrm = -nrm;
        }
        for (i = k; i < m; i++) {
          qr.set(i, k, qr.get(i, k) / nrm);
        }
        qr.set(k, k, qr.get(k, k) + 1);
        for (j = k + 1; j < n; j++) {
          s = 0;
          for (i = k; i < m; i++) {
            s += qr.get(i, k) * qr.get(i, j);
          }
          s = -s / qr.get(k, k);
          for (i = k; i < m; i++) {
            qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
          }
        }
      }
      rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
  }

  /**
   * Solve a problem of least square (Ax=b) by using the QR decomposition. Useful when A is rectangular, but not working when A is singular.
   * Example : We search to approximate x, with A matrix shape m*n, x vector size n, b vector size m (m > n). We will use :
   * var qr = QrDecomposition(A);
   * var x = qr.solve(b);
   * @param {Matrix} value - Matrix 1D which is the vector b (in the equation Ax = b)
   * @return {Matrix} - The vector x
   */
  solve(value) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].checkMatrix(value);

    var qr = this.QR;
    var m = qr.rows;

    if (value.rows !== m) {
      throw new Error('Matrix row dimensions must agree');
    }
    if (!this.isFullRank()) {
      throw new Error('Matrix is rank deficient');
    }

    var count = value.columns;
    var X = value.clone();
    var n = qr.columns;
    var i, j, k, s;

    for (k = 0; k < n; k++) {
      for (j = 0; j < count; j++) {
        s = 0;
        for (i = k; i < m; i++) {
          s += qr[i][k] * X[i][j];
        }
        s = -s / qr[k][k];
        for (i = k; i < m; i++) {
          X[i][j] += s * qr[i][k];
        }
      }
    }
    for (k = n - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X[k][j] /= this.Rdiag[k];
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X[i][j] -= X[k][j] * qr[i][k];
        }
      }
    }

    return X.subMatrix(0, n - 1, 0, count - 1);
  }

  /**
   *
   * @return {boolean}
   */
  isFullRank() {
    var columns = this.QR.columns;
    for (var i = 0; i < columns; i++) {
      if (this.Rdiag[i] === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @return {Matrix}
   */
  get upperTriangularMatrix() {
    var qr = this.QR;
    var n = qr.columns;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](n, n);
    var i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if (i < j) {
          X[i][j] = qr[i][j];
        } else if (i === j) {
          X[i][j] = this.Rdiag[i];
        } else {
          X[i][j] = 0;
        }
      }
    }
    return X;
  }

  /**
   *
   * @return {Matrix}
   */
  get orthogonalMatrix() {
    var qr = this.QR;
    var rows = qr.rows;
    var columns = qr.columns;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](rows, columns);
    var i, j, k, s;

    for (k = columns - 1; k >= 0; k--) {
      for (i = 0; i < rows; i++) {
        X[i][k] = 0;
      }
      X[k][k] = 1;
      for (j = k; j < columns; j++) {
        if (qr[k][k] !== 0) {
          s = 0;
          for (i = k; i < rows; i++) {
            s += qr[i][k] * X[i][j];
          }

          s = -s / qr[k][k];

          for (i = k; i < rows; i++) {
            X[i][j] += s * qr[i][k];
          }
        }
      }
    }
    return X;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/svd.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/svd.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SingularValueDecomposition; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./node_modules/ml-matrix/src/index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");




/**
 * @class SingularValueDecomposition
 * @see https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
 * @param {Matrix} value
 * @param {object} [options]
 * @param {boolean} [options.computeLeftSingularVectors=true]
 * @param {boolean} [options.computeRightSingularVectors=true]
 * @param {boolean} [options.autoTranspose=false]
 */
class SingularValueDecomposition {
  constructor(value, options = {}) {
    value = _index__WEBPACK_IMPORTED_MODULE_0__["WrapperMatrix2D"].checkMatrix(value);

    var m = value.rows;
    var n = value.columns;

    const {
      computeLeftSingularVectors = true,
      computeRightSingularVectors = true,
      autoTranspose = false
    } = options;

    var wantu = Boolean(computeLeftSingularVectors);
    var wantv = Boolean(computeRightSingularVectors);

    var swapped = false;
    var a;
    if (m < n) {
      if (!autoTranspose) {
        a = value.clone();
        // eslint-disable-next-line no-console
        console.warn(
          'Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose'
        );
      } else {
        a = value.transpose();
        m = a.rows;
        n = a.columns;
        swapped = true;
        var aux = wantu;
        wantu = wantv;
        wantv = aux;
      }
    } else {
      a = value.clone();
    }

    var nu = Math.min(m, n);
    var ni = Math.min(m + 1, n);
    var s = new Array(ni);
    var U = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getFilled2DArray"])(m, nu, 0);
    var V = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getFilled2DArray"])(n, n, 0);

    var e = new Array(n);
    var work = new Array(m);

    var si = new Array(ni);
    for (let i = 0; i < ni; i++) si[i] = i;

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));
    var mrc = Math.max(nct, nrt);

    for (let k = 0; k < mrc; k++) {
      if (k < nct) {
        s[k] = 0;
        for (let i = k; i < m; i++) {
          s[k] = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(s[k], a[i][k]);
        }
        if (s[k] !== 0) {
          if (a[k][k] < 0) {
            s[k] = -s[k];
          }
          for (let i = k; i < m; i++) {
            a[i][k] /= s[k];
          }
          a[k][k] += 1;
        }
        s[k] = -s[k];
      }

      for (let j = k + 1; j < n; j++) {
        if (k < nct && s[k] !== 0) {
          let t = 0;
          for (let i = k; i < m; i++) {
            t += a[i][k] * a[i][j];
          }
          t = -t / a[k][k];
          for (let i = k; i < m; i++) {
            a[i][j] += t * a[i][k];
          }
        }
        e[j] = a[k][j];
      }

      if (wantu && k < nct) {
        for (let i = k; i < m; i++) {
          U[i][k] = a[i][k];
        }
      }

      if (k < nrt) {
        e[k] = 0;
        for (let i = k + 1; i < n; i++) {
          e[k] = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(e[k], e[i]);
        }
        if (e[k] !== 0) {
          if (e[k + 1] < 0) {
            e[k] = 0 - e[k];
          }
          for (let i = k + 1; i < n; i++) {
            e[i] /= e[k];
          }
          e[k + 1] += 1;
        }
        e[k] = -e[k];
        if (k + 1 < m && e[k] !== 0) {
          for (let i = k + 1; i < m; i++) {
            work[i] = 0;
          }
          for (let i = k + 1; i < m; i++) {
            for (let j = k + 1; j < n; j++) {
              work[i] += e[j] * a[i][j];
            }
          }
          for (let j = k + 1; j < n; j++) {
            let t = -e[j] / e[k + 1];
            for (let i = k + 1; i < m; i++) {
              a[i][j] += t * work[i];
            }
          }
        }
        if (wantv) {
          for (let i = k + 1; i < n; i++) {
            V[i][k] = e[i];
          }
        }
      }
    }

    let p = Math.min(n, m + 1);
    if (nct < n) {
      s[nct] = a[nct][nct];
    }
    if (m < p) {
      s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
      e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
      for (let j = nct; j < nu; j++) {
        for (let i = 0; i < m; i++) {
          U[i][j] = 0;
        }
        U[j][j] = 1;
      }
      for (let k = nct - 1; k >= 0; k--) {
        if (s[k] !== 0) {
          for (let j = k + 1; j < nu; j++) {
            let t = 0;
            for (let i = k; i < m; i++) {
              t += U[i][k] * U[i][j];
            }
            t = -t / U[k][k];
            for (let i = k; i < m; i++) {
              U[i][j] += t * U[i][k];
            }
          }
          for (let i = k; i < m; i++) {
            U[i][k] = -U[i][k];
          }
          U[k][k] = 1 + U[k][k];
          for (let i = 0; i < k - 1; i++) {
            U[i][k] = 0;
          }
        } else {
          for (let i = 0; i < m; i++) {
            U[i][k] = 0;
          }
          U[k][k] = 1;
        }
      }
    }

    if (wantv) {
      for (let k = n - 1; k >= 0; k--) {
        if (k < nrt && e[k] !== 0) {
          for (let j = k + 1; j < n; j++) {
            let t = 0;
            for (let i = k + 1; i < n; i++) {
              t += V[i][k] * V[i][j];
            }
            t = -t / V[k + 1][k];
            for (let i = k + 1; i < n; i++) {
              V[i][j] += t * V[i][k];
            }
          }
        }
        for (let i = 0; i < n; i++) {
          V[i][k] = 0;
        }
        V[k][k] = 1;
      }
    }

    var pp = p - 1;
    var iter = 0;
    var eps = Number.EPSILON;
    while (p > 0) {
      let k, kase;
      for (k = p - 2; k >= -1; k--) {
        if (k === -1) {
          break;
        }
        const alpha =
          Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
        if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
          e[k] = 0;
          break;
        }
      }
      if (k === p - 2) {
        kase = 4;
      } else {
        let ks;
        for (ks = p - 1; ks >= k; ks--) {
          if (ks === k) {
            break;
          }
          let t =
            (ks !== p ? Math.abs(e[ks]) : 0) +
            (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
          if (Math.abs(s[ks]) <= eps * t) {
            s[ks] = 0;
            break;
          }
        }
        if (ks === k) {
          kase = 3;
        } else if (ks === p - 1) {
          kase = 1;
        } else {
          kase = 2;
          k = ks;
        }
      }

      k++;

      switch (kase) {
        case 1: {
          let f = e[p - 2];
          e[p - 2] = 0;
          for (let j = p - 2; j >= k; j--) {
            let t = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(s[j], f);
            let cs = s[j] / t;
            let sn = f / t;
            s[j] = t;
            if (j !== k) {
              f = -sn * e[j - 1];
              e[j - 1] = cs * e[j - 1];
            }
            if (wantv) {
              for (let i = 0; i < n; i++) {
                t = cs * V[i][j] + sn * V[i][p - 1];
                V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                V[i][j] = t;
              }
            }
          }
          break;
        }
        case 2: {
          let f = e[k - 1];
          e[k - 1] = 0;
          for (let j = k; j < p; j++) {
            let t = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(s[j], f);
            let cs = s[j] / t;
            let sn = f / t;
            s[j] = t;
            f = -sn * e[j];
            e[j] = cs * e[j];
            if (wantu) {
              for (let i = 0; i < m; i++) {
                t = cs * U[i][j] + sn * U[i][k - 1];
                U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                U[i][j] = t;
              }
            }
          }
          break;
        }
        case 3: {
          const scale = Math.max(
            Math.abs(s[p - 1]),
            Math.abs(s[p - 2]),
            Math.abs(e[p - 2]),
            Math.abs(s[k]),
            Math.abs(e[k])
          );
          const sp = s[p - 1] / scale;
          const spm1 = s[p - 2] / scale;
          const epm1 = e[p - 2] / scale;
          const sk = s[k] / scale;
          const ek = e[k] / scale;
          const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
          const c = sp * epm1 * (sp * epm1);
          let shift = 0;
          if (b !== 0 || c !== 0) {
            if (b < 0) {
              shift = 0 - Math.sqrt(b * b + c);
            } else {
              shift = Math.sqrt(b * b + c);
            }
            shift = c / (b + shift);
          }
          let f = (sk + sp) * (sk - sp) + shift;
          let g = sk * ek;
          for (let j = k; j < p - 1; j++) {
            let t = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(f, g);
            if (t === 0) t = Number.MIN_VALUE;
            let cs = f / t;
            let sn = g / t;
            if (j !== k) {
              e[j - 1] = t;
            }
            f = cs * s[j] + sn * e[j];
            e[j] = cs * e[j] - sn * s[j];
            g = sn * s[j + 1];
            s[j + 1] = cs * s[j + 1];
            if (wantv) {
              for (let i = 0; i < n; i++) {
                t = cs * V[i][j] + sn * V[i][j + 1];
                V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                V[i][j] = t;
              }
            }
            t = Object(_util__WEBPACK_IMPORTED_MODULE_1__["hypotenuse"])(f, g);
            if (t === 0) t = Number.MIN_VALUE;
            cs = f / t;
            sn = g / t;
            s[j] = t;
            f = cs * e[j] + sn * s[j + 1];
            s[j + 1] = -sn * e[j] + cs * s[j + 1];
            g = sn * e[j + 1];
            e[j + 1] = cs * e[j + 1];
            if (wantu && j < m - 1) {
              for (let i = 0; i < m; i++) {
                t = cs * U[i][j] + sn * U[i][j + 1];
                U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                U[i][j] = t;
              }
            }
          }
          e[p - 2] = f;
          iter = iter + 1;
          break;
        }
        case 4: {
          if (s[k] <= 0) {
            s[k] = s[k] < 0 ? -s[k] : 0;
            if (wantv) {
              for (let i = 0; i <= pp; i++) {
                V[i][k] = -V[i][k];
              }
            }
          }
          while (k < pp) {
            if (s[k] >= s[k + 1]) {
              break;
            }
            let t = s[k];
            s[k] = s[k + 1];
            s[k + 1] = t;
            if (wantv && k < n - 1) {
              for (let i = 0; i < n; i++) {
                t = V[i][k + 1];
                V[i][k + 1] = V[i][k];
                V[i][k] = t;
              }
            }
            if (wantu && k < m - 1) {
              for (let i = 0; i < m; i++) {
                t = U[i][k + 1];
                U[i][k + 1] = U[i][k];
                U[i][k] = t;
              }
            }
            k++;
          }
          iter = 0;
          p--;
          break;
        }
        // no default
      }
    }

    if (swapped) {
      var tmp = V;
      V = U;
      U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
  }

  /**
   * Solve a problem of least square (Ax=b) by using the SVD. Useful when A is singular. When A is not singular, it would be better to use qr.solve(value).
   * Example : We search to approximate x, with A matrix shape m*n, x vector size n, b vector size m (m > n). We will use :
   * var svd = SingularValueDecomposition(A);
   * var x = svd.solve(b);
   * @param {Matrix} value - Matrix 1D which is the vector b (in the equation Ax = b)
   * @return {Matrix} - The vector x
   */
  solve(value) {
    var Y = value;
    var e = this.threshold;
    var scols = this.s.length;
    var Ls = _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].zeros(scols, scols);

    for (let i = 0; i < scols; i++) {
      if (Math.abs(this.s[i]) <= e) {
        Ls[i][i] = 0;
      } else {
        Ls[i][i] = 1 / this.s[i];
      }
    }

    var U = this.U;
    var V = this.rightSingularVectors;

    var VL = V.mmul(Ls);
    var vrows = V.rows;
    var urows = U.length;
    var VLU = _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].zeros(vrows, urows);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < scols; k++) {
          sum += VL[i][k] * U[j][k];
        }
        VLU[i][j] = sum;
      }
    }

    return VLU.mmul(Y);
  }

  /**
   *
   * @param {Array<number>} value
   * @return {Matrix}
   */
  solveForDiagonal(value) {
    return this.solve(_index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].diag(value));
  }

  /**
   * Get the inverse of the matrix. We compute the inverse of a matrix using SVD when this matrix is singular or ill-conditioned. Example :
   * var svd = SingularValueDecomposition(A);
   * var inverseA = svd.inverse();
   * @return {Matrix} - The approximation of the inverse of the matrix
   */
  inverse() {
    var V = this.V;
    var e = this.threshold;
    var vrows = V.length;
    var vcols = V[0].length;
    var X = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](vrows, this.s.length);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < vcols; j++) {
        if (Math.abs(this.s[j]) > e) {
          X[i][j] = V[i][j] / this.s[j];
        } else {
          X[i][j] = 0;
        }
      }
    }

    var U = this.U;

    var urows = U.length;
    var ucols = U[0].length;
    var Y = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](vrows, urows);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < ucols; k++) {
          sum += X[i][k] * U[j][k];
        }
        Y[i][j] = sum;
      }
    }

    return Y;
  }

  /**
   *
   * @return {number}
   */
  get condition() {
    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
  }

  /**
   *
   * @return {number}
   */
  get norm2() {
    return this.s[0];
  }

  /**
   *
   * @return {number}
   */
  get rank() {
    var tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
    var r = 0;
    var s = this.s;
    for (var i = 0, ii = s.length; i < ii; i++) {
      if (s[i] > tol) {
        r++;
      }
    }
    return r;
  }

  /**
   *
   * @return {Array<number>}
   */
  get diagonal() {
    return this.s;
  }

  /**
   *
   * @return {number}
   */
  get threshold() {
    return Number.EPSILON / 2 * Math.max(this.m, this.n) * this.s[0];
  }

  /**
   *
   * @return {Matrix}
   */
  get leftSingularVectors() {
    if (!_index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].isMatrix(this.U)) {
      this.U = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](this.U);
    }
    return this.U;
  }

  /**
   *
   * @return {Matrix}
   */
  get rightSingularVectors() {
    if (!_index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].isMatrix(this.V)) {
      this.V = new _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"](this.V);
    }
    return this.V;
  }

  /**
   *
   * @return {Matrix}
   */
  get diagonalMatrix() {
    return _index__WEBPACK_IMPORTED_MODULE_0__["Matrix"].diag(this.s);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/util.js":
/*!***********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/util.js ***!
  \***********************************************/
/*! exports provided: hypotenuse, getFilled2DArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hypotenuse", function() { return hypotenuse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFilled2DArray", function() { return getFilled2DArray; });
function hypotenuse(a, b) {
  var r = 0;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    return Math.abs(a) * Math.sqrt(1 + r * r);
  }
  if (b !== 0) {
    r = a / b;
    return Math.abs(b) * Math.sqrt(1 + r * r);
  }
  return 0;
}

function getFilled2DArray(rows, columns, value) {
  var array = new Array(rows);
  for (var i = 0; i < rows; i++) {
    array[i] = new Array(columns);
    for (var j = 0; j < columns; j++) {
      array[i][j] = value;
    }
  }
  return array;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/decompositions.js":
/*!******************************************************!*\
  !*** ./node_modules/ml-matrix/src/decompositions.js ***!
  \******************************************************/
/*! exports provided: inverse, solve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return solve; });
/* harmony import */ var _dc_lu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dc/lu */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony import */ var _dc_qr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dc/qr */ "./node_modules/ml-matrix/src/dc/qr.js");
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ "./node_modules/ml-matrix/src/index.js");






/**
 * Computes the inverse of a Matrix
 * @param {Matrix} matrix
 * @param {boolean} [useSVD=false]
 * @return {Matrix}
 */
function inverse(matrix, useSVD = false) {
  matrix = _index__WEBPACK_IMPORTED_MODULE_3__["WrapperMatrix2D"].checkMatrix(matrix);
  if (useSVD) {
    return new _dc_svd__WEBPACK_IMPORTED_MODULE_2__["default"](matrix).inverse();
  } else {
    return solve(matrix, _index__WEBPACK_IMPORTED_MODULE_3__["Matrix"].eye(matrix.rows));
  }
}

/**
 *
 * @param {Matrix} leftHandSide
 * @param {Matrix} rightHandSide
 * @param {boolean} [useSVD = false]
 * @return {Matrix}
 */
function solve(leftHandSide, rightHandSide, useSVD = false) {
  leftHandSide = _index__WEBPACK_IMPORTED_MODULE_3__["WrapperMatrix2D"].checkMatrix(leftHandSide);
  rightHandSide = _index__WEBPACK_IMPORTED_MODULE_3__["WrapperMatrix2D"].checkMatrix(rightHandSide);
  if (useSVD) {
    return new _dc_svd__WEBPACK_IMPORTED_MODULE_2__["default"](leftHandSide).solve(rightHandSide);
  } else {
    return leftHandSide.isSquare()
      ? new _dc_lu__WEBPACK_IMPORTED_MODULE_0__["default"](leftHandSide).solve(rightHandSide)
      : new _dc_qr__WEBPACK_IMPORTED_MODULE_1__["default"](leftHandSide).solve(rightHandSide);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/index.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/index.js ***!
  \*********************************************/
/*! exports provided: default, Matrix, abstractMatrix, wrap, WrapperMatrix2D, WrapperMatrix1D, solve, inverse, linearDependencies, SingularValueDecomposition, SVD, EigenvalueDecomposition, EVD, CholeskyDecomposition, CHO, LuDecomposition, LU, QrDecomposition, QR */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _matrix__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Matrix", function() { return _matrix__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _abstractMatrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abstractMatrix */ "./node_modules/ml-matrix/src/abstractMatrix.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "abstractMatrix", function() { return _abstractMatrix__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _wrap_wrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wrap/wrap */ "./node_modules/ml-matrix/src/wrap/wrap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return _wrap_wrap__WEBPACK_IMPORTED_MODULE_2__["wrap"]; });

/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WrapperMatrix2D", function() { return _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _wrap_WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wrap/WrapperMatrix1D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WrapperMatrix1D", function() { return _wrap_WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _decompositions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./decompositions */ "./node_modules/ml-matrix/src/decompositions.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return _decompositions__WEBPACK_IMPORTED_MODULE_5__["solve"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return _decompositions__WEBPACK_IMPORTED_MODULE_5__["inverse"]; });

/* harmony import */ var _linearDependencies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./linearDependencies */ "./node_modules/ml-matrix/src/linearDependencies.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "linearDependencies", function() { return _linearDependencies__WEBPACK_IMPORTED_MODULE_6__["linearDependencies"]; });

/* harmony import */ var _dc_svd_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dc/svd.js */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SingularValueDecomposition", function() { return _dc_svd_js__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SVD", function() { return _dc_svd_js__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _dc_evd_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dc/evd.js */ "./node_modules/ml-matrix/src/dc/evd.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EigenvalueDecomposition", function() { return _dc_evd_js__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EVD", function() { return _dc_evd_js__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony import */ var _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dc/cholesky.js */ "./node_modules/ml-matrix/src/dc/cholesky.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CholeskyDecomposition", function() { return _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CHO", function() { return _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _dc_lu_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dc/lu.js */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LuDecomposition", function() { return _dc_lu_js__WEBPACK_IMPORTED_MODULE_10__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LU", function() { return _dc_lu_js__WEBPACK_IMPORTED_MODULE_10__["default"]; });

/* harmony import */ var _dc_qr_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dc/qr.js */ "./node_modules/ml-matrix/src/dc/qr.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QrDecomposition", function() { return _dc_qr_js__WEBPACK_IMPORTED_MODULE_11__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QR", function() { return _dc_qr_js__WEBPACK_IMPORTED_MODULE_11__["default"]; });

















/***/ }),

/***/ "./node_modules/ml-matrix/src/linearDependencies.js":
/*!**********************************************************!*\
  !*** ./node_modules/ml-matrix/src/linearDependencies.js ***!
  \**********************************************************/
/*! exports provided: linearDependencies */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearDependencies", function() { return linearDependencies; });
/* harmony import */ var ml_array_max__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ml-array-max */ "./node_modules/ml-array-max/lib-es6/index.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");





// function used by rowsDependencies
function xrange(n, exception) {
  var range = [];
  for (var i = 0; i < n; i++) {
    if (i !== exception) {
      range.push(i);
    }
  }
  return range;
}

// function used by rowsDependencies
function dependenciesOneRow(
  error,
  matrix,
  index,
  thresholdValue = 10e-10,
  thresholdError = 10e-10
) {
  if (error > thresholdError) {
    return new Array(matrix.rows + 1).fill(0);
  } else {
    var returnArray = matrix.addRow(index, [0]);
    for (var i = 0; i < returnArray.rows; i++) {
      if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
        returnArray.set(i, 0, 0);
      }
    }
    return returnArray.to1DArray();
  }
}

/**
 * Creates a matrix which represents the dependencies between rows.
 * If a row is a linear combination of others rows, the result will be a row with the coefficients of this combination.
 * For example : for A = [[2, 0, 0, 1], [0, 1, 6, 0], [0, 3, 0, 1], [0, 0, 1, 0], [0, 1, 2, 0]], the result will be [[0, 0, 0, 0, 0], [0, 0, 0, 4, 1], [0, 0, 0, 0, 0], [0, 0.25, 0, 0, -0.25], [0, 1, 0, -4, 0]]
 * @param {Matrix} matrix
 * @param {Object} [options] includes thresholdValue and thresholdError.
 * @param {number} [options.thresholdValue = 10e-10] If an absolute value is inferior to this threshold, it will equals zero.
 * @param {number} [options.thresholdError = 10e-10] If the error is inferior to that threshold, the linear combination found is accepted and the row is dependent from other rows.
 * @return {Matrix} the matrix which represents the dependencies between rows.
 */

function linearDependencies(matrix, options = {}) {
  const { thresholdValue = 10e-10, thresholdError = 10e-10 } = options;

  var n = matrix.rows;
  var results = new _matrix__WEBPACK_IMPORTED_MODULE_1__["default"](n, n);

  for (var i = 0; i < n; i++) {
    var b = _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].columnVector(matrix.getRow(i));
    var Abis = matrix.subMatrixRow(xrange(n, i)).transposeView();
    var svd = new _dc_svd__WEBPACK_IMPORTED_MODULE_2__["default"](Abis);
    var x = svd.solve(b);
    var error = Object(ml_array_max__WEBPACK_IMPORTED_MODULE_0__["default"])(
      _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].sub(b, Abis.mmul(x))
        .abs()
        .to1DArray()
    );
    results.setRow(
      i,
      dependenciesOneRow(error, x, i, thresholdValue, thresholdError)
    );
  }
  return results;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/matrix.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/matrix.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Matrix; });
/* harmony import */ var _abstractMatrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstractMatrix */ "./node_modules/ml-matrix/src/abstractMatrix.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/util.js");



class Matrix extends Object(_abstractMatrix__WEBPACK_IMPORTED_MODULE_0__["default"])(Array) {
  constructor(nRows, nColumns) {
    var i;
    if (arguments.length === 1 && typeof nRows === 'number') {
      return new Array(nRows);
    }
    if (Matrix.isMatrix(nRows)) {
      return nRows.clone();
    } else if (Number.isInteger(nRows) && nRows > 0) {
      // Create an empty matrix
      super(nRows);
      if (Number.isInteger(nColumns) && nColumns > 0) {
        for (i = 0; i < nRows; i++) {
          this[i] = new Array(nColumns);
        }
      } else {
        throw new TypeError('nColumns must be a positive integer');
      }
    } else if (Array.isArray(nRows)) {
      // Copy the values from the 2D array
      const matrix = nRows;
      nRows = matrix.length;
      nColumns = matrix[0].length;
      if (typeof nColumns !== 'number' || nColumns === 0) {
        throw new TypeError(
          'Data must be a 2D array with at least one element'
        );
      }
      super(nRows);
      for (i = 0; i < nRows; i++) {
        if (matrix[i].length !== nColumns) {
          throw new RangeError('Inconsistent array dimensions');
        }
        this[i] = [].concat(matrix[i]);
      }
    } else {
      throw new TypeError(
        'First argument must be a positive number or an array'
      );
    }
    this.rows = nRows;
    this.columns = nColumns;
    return this;
  }

  set(rowIndex, columnIndex, value) {
    this[rowIndex][columnIndex] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    return this[rowIndex][columnIndex];
  }

  /**
   * Removes a row from the given index
   * @param {number} index - Row index
   * @return {Matrix} this
   */
  removeRow(index) {
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkRowIndex"])(this, index);
    if (this.rows === 1) {
      throw new RangeError('A matrix cannot have less than one row');
    }
    this.splice(index, 1);
    this.rows -= 1;
    return this;
  }

  /**
   * Adds a row at the given index
   * @param {number} [index = this.rows] - Row index
   * @param {Array|Matrix} array - Array or vector
   * @return {Matrix} this
   */
  addRow(index, array) {
    if (array === undefined) {
      array = index;
      index = this.rows;
    }
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkRowIndex"])(this, index, true);
    array = Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkRowVector"])(this, array, true);
    this.splice(index, 0, array);
    this.rows += 1;
    return this;
  }

  /**
   * Removes a column from the given index
   * @param {number} index - Column index
   * @return {Matrix} this
   */
  removeColumn(index) {
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkColumnIndex"])(this, index);
    if (this.columns === 1) {
      throw new RangeError('A matrix cannot have less than one column');
    }
    for (var i = 0; i < this.rows; i++) {
      this[i].splice(index, 1);
    }
    this.columns -= 1;
    return this;
  }

  /**
   * Adds a column at the given index
   * @param {number} [index = this.columns] - Column index
   * @param {Array|Matrix} array - Array or vector
   * @return {Matrix} this
   */
  addColumn(index, array) {
    if (typeof array === 'undefined') {
      array = index;
      index = this.columns;
    }
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkColumnIndex"])(this, index, true);
    array = Object(_util__WEBPACK_IMPORTED_MODULE_1__["checkColumnVector"])(this, array);
    for (var i = 0; i < this.rows; i++) {
      this[i].splice(index, 0, array[i]);
    }
    this.columns += 1;
    return this;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/util.js":
/*!********************************************!*\
  !*** ./node_modules/ml-matrix/src/util.js ***!
  \********************************************/
/*! exports provided: checkRowIndex, checkColumnIndex, checkRowVector, checkColumnVector, checkIndices, checkRowIndices, checkColumnIndices, checkRange, getRange, sumByRow, sumByColumn, sumAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkRowIndex", function() { return checkRowIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkColumnIndex", function() { return checkColumnIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkRowVector", function() { return checkRowVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkColumnVector", function() { return checkColumnVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkIndices", function() { return checkIndices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkRowIndices", function() { return checkRowIndices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkColumnIndices", function() { return checkColumnIndices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkRange", function() { return checkRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRange", function() { return getRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sumByRow", function() { return sumByRow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sumByColumn", function() { return sumByColumn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sumAll", function() { return sumAll; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");


/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkRowIndex(matrix, index, outer) {
  var max = outer ? matrix.rows : matrix.rows - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Row index out of range');
  }
}

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkColumnIndex(matrix, index, outer) {
  var max = outer ? matrix.columns : matrix.columns - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Column index out of range');
  }
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkRowVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.columns) {
    throw new RangeError(
      'vector size must be the same as the number of columns'
    );
  }
  return vector;
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkColumnVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.rows) {
    throw new RangeError('vector size must be the same as the number of rows');
  }
  return vector;
}

function checkIndices(matrix, rowIndices, columnIndices) {
  return {
    row: checkRowIndices(matrix, rowIndices),
    column: checkColumnIndices(matrix, columnIndices)
  };
}

function checkRowIndices(matrix, rowIndices) {
  if (typeof rowIndices !== 'object') {
    throw new TypeError('unexpected type for row indices');
  }

  var rowOut = rowIndices.some((r) => {
    return r < 0 || r >= matrix.rows;
  });

  if (rowOut) {
    throw new RangeError('row indices are out of range');
  }

  if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);

  return rowIndices;
}

function checkColumnIndices(matrix, columnIndices) {
  if (typeof columnIndices !== 'object') {
    throw new TypeError('unexpected type for column indices');
  }

  var columnOut = columnIndices.some((c) => {
    return c < 0 || c >= matrix.columns;
  });

  if (columnOut) {
    throw new RangeError('column indices are out of range');
  }
  if (!Array.isArray(columnIndices)) columnIndices = Array.from(columnIndices);

  return columnIndices;
}

function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
  if (arguments.length !== 5) {
    throw new RangeError('expected 4 arguments');
  }
  checkNumber('startRow', startRow);
  checkNumber('endRow', endRow);
  checkNumber('startColumn', startColumn);
  checkNumber('endColumn', endColumn);
  if (
    startRow > endRow ||
    startColumn > endColumn ||
    startRow < 0 ||
    startRow >= matrix.rows ||
    endRow < 0 ||
    endRow >= matrix.rows ||
    startColumn < 0 ||
    startColumn >= matrix.columns ||
    endColumn < 0 ||
    endColumn >= matrix.columns
  ) {
    throw new RangeError('Submatrix indices are out of range');
  }
}

function getRange(from, to) {
  var arr = new Array(to - from + 1);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = from + i;
  }
  return arr;
}

function sumByRow(matrix) {
  var sum = _matrix__WEBPACK_IMPORTED_MODULE_0__["default"].zeros(matrix.rows, 1);
  for (var i = 0; i < matrix.rows; ++i) {
    for (var j = 0; j < matrix.columns; ++j) {
      sum.set(i, 0, sum.get(i, 0) + matrix.get(i, j));
    }
  }
  return sum;
}

function sumByColumn(matrix) {
  var sum = _matrix__WEBPACK_IMPORTED_MODULE_0__["default"].zeros(1, matrix.columns);
  for (var i = 0; i < matrix.rows; ++i) {
    for (var j = 0; j < matrix.columns; ++j) {
      sum.set(0, j, sum.get(0, j) + matrix.get(i, j));
    }
  }
  return sum;
}

function sumAll(matrix) {
  var v = 0;
  for (var i = 0; i < matrix.rows; i++) {
    for (var j = 0; j < matrix.columns; j++) {
      v += matrix.get(i, j);
    }
  }
  return v;
}

function checkNumber(name, value) {
  if (typeof value !== 'number') {
    throw new TypeError(`${name} must be a number`);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/base.js":
/*!**************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/base.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BaseView; });
/* harmony import */ var _abstractMatrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../abstractMatrix */ "./node_modules/ml-matrix/src/abstractMatrix.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");



class BaseView extends Object(_abstractMatrix__WEBPACK_IMPORTED_MODULE_0__["default"])() {
  constructor(matrix, rows, columns) {
    super();
    this.matrix = matrix;
    this.rows = rows;
    this.columns = columns;
  }

  static get [Symbol.species]() {
    return _matrix__WEBPACK_IMPORTED_MODULE_1__["default"];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/column.js":
/*!****************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/column.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixColumnView; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixColumnView extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(matrix, column) {
    super(matrix, matrix.rows, 1);
    this.column = column;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.column, value);
    return this;
  }

  get(rowIndex) {
    return this.matrix.get(rowIndex, this.column);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/columnSelection.js":
/*!*************************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/columnSelection.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixColumnSelectionView; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixColumnSelectionView extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(matrix, columnIndices) {
    columnIndices = Object(_util__WEBPACK_IMPORTED_MODULE_0__["checkColumnIndices"])(matrix, columnIndices);
    super(matrix, matrix.rows, columnIndices.length);
    this.columnIndices = columnIndices;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/flipColumn.js":
/*!********************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/flipColumn.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixFlipColumnView; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixFlipColumnView extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/flipRow.js":
/*!*****************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/flipRow.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixFlipRowView; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixFlipRowView extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/row.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/row.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixRowView; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixRowView extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(matrix, row) {
    super(matrix, 1, matrix.columns);
    this.row = row;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.row, columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.row, columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/rowSelection.js":
/*!**********************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/rowSelection.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixRowSelectionView; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixRowSelectionView extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(matrix, rowIndices) {
    rowIndices = Object(_util__WEBPACK_IMPORTED_MODULE_0__["checkRowIndices"])(matrix, rowIndices);
    super(matrix, rowIndices.length, matrix.columns);
    this.rowIndices = rowIndices;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/selection.js":
/*!*******************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/selection.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixSelectionView; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixSelectionView extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(matrix, rowIndices, columnIndices) {
    var indices = Object(_util__WEBPACK_IMPORTED_MODULE_0__["checkIndices"])(matrix, rowIndices, columnIndices);
    super(matrix, indices.row.length, indices.column.length);
    this.rowIndices = indices.row;
    this.columnIndices = indices.column;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(
      this.rowIndices[rowIndex],
      this.columnIndices[columnIndex],
      value
    );
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(
      this.rowIndices[rowIndex],
      this.columnIndices[columnIndex]
    );
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/sub.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/sub.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixSubView; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixSubView extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(matrix, startRow, endRow, startColumn, endColumn) {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["checkRange"])(matrix, startRow, endRow, startColumn, endColumn);
    super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
    this.startRow = startRow;
    this.startColumn = startColumn;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(
      this.startRow + rowIndex,
      this.startColumn + columnIndex,
      value
    );
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(
      this.startRow + rowIndex,
      this.startColumn + columnIndex
    );
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/transpose.js":
/*!*******************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/transpose.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MatrixTransposeView; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixTransposeView extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(matrix) {
    super(matrix, matrix.columns, matrix.rows);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(columnIndex, rowIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(columnIndex, rowIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js":
/*!************************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WrapperMatrix1D; });
/* harmony import */ var _abstractMatrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../abstractMatrix */ "./node_modules/ml-matrix/src/abstractMatrix.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");



class WrapperMatrix1D extends Object(_abstractMatrix__WEBPACK_IMPORTED_MODULE_0__["default"])() {
  /**
   * @class WrapperMatrix1D
   * @param {Array<number>} data
   * @param {object} [options]
   * @param {object} [options.rows = 1]
   */
  constructor(data, options = {}) {
    const { rows = 1 } = options;

    if (data.length % rows !== 0) {
      throw new Error('the data length is not divisible by the number of rows');
    }
    super();
    this.rows = rows;
    this.columns = data.length / rows;
    this.data = data;
  }

  set(rowIndex, columnIndex, value) {
    var index = this._calculateIndex(rowIndex, columnIndex);
    this.data[index] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    var index = this._calculateIndex(rowIndex, columnIndex);
    return this.data[index];
  }

  _calculateIndex(row, column) {
    return row * this.columns + column;
  }

  static get [Symbol.species]() {
    return _matrix__WEBPACK_IMPORTED_MODULE_1__["default"];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js":
/*!************************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WrapperMatrix2D; });
/* harmony import */ var _abstractMatrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../abstractMatrix */ "./node_modules/ml-matrix/src/abstractMatrix.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");



class WrapperMatrix2D extends Object(_abstractMatrix__WEBPACK_IMPORTED_MODULE_0__["default"])() {
  /**
   * @class WrapperMatrix2D
   * @param {Array<Array<number>>} data
   */
  constructor(data) {
    super();
    this.data = data;
    this.rows = data.length;
    this.columns = data[0].length;
  }

  set(rowIndex, columnIndex, value) {
    this.data[rowIndex][columnIndex] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.data[rowIndex][columnIndex];
  }

  static get [Symbol.species]() {
    return _matrix__WEBPACK_IMPORTED_MODULE_1__["default"];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/wrap.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/wrap.js ***!
  \*************************************************/
/*! exports provided: wrap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return wrap; });
/* harmony import */ var _WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WrapperMatrix1D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js");
/* harmony import */ var _WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");



/**
 * @param {Array<Array<number>>|Array<number>} array
 * @param {object} [options]
 * @param {object} [options.rows = 1]
 * @return {WrapperMatrix1D|WrapperMatrix2D}
 */
function wrap(array, options) {
  if (Array.isArray(array)) {
    if (array[0] && Array.isArray(array[0])) {
      return new _WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_1__["default"](array);
    } else {
      return new _WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_0__["default"](array, options);
    }
  } else {
    throw new Error('the argument is not an array');
  }
}


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./src/components/Utility/UMAP/heap.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/heap.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smallestFlagged = exports.deheapSort = exports.buildCandidates = exports.uncheckedHeapPush = exports.heapPush = exports.rejectionSample = exports.makeHeap = void 0;

var utils = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
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
    return utils.empty(nPoints).map(function () {
      return utils.filled(size, fillValue);
    });
  };

  var heap = [];
  heap.push(makeArrays(-1));
  heap.push(makeArrays(Infinity));
  heap.push(makeArrays(0));
  return heap;
}

exports.makeHeap = makeHeap;
/**
 * Generate n_samples many integers from 0 to pool_size such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */

function rejectionSample(nSamples, poolSize, random) {
  var result = utils.zeros(nSamples);

  for (var i = 0; i < nSamples; i++) {
    var rejectSample = true;
    var j = 0;

    while (rejectSample) {
      j = utils.tauRandInt(poolSize, random);
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

exports.rejectionSample = rejectionSample;
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

exports.heapPush = heapPush;
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
    } else {
      if (weight < weights[ic2]) {
        iSwap = ic2;
      } else {
        break;
      }
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

exports.uncheckedHeapPush = uncheckedHeapPush;
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
      var d = utils.tauRand(random);
      heapPush(candidateNeighbors, i, d, idx, isn);
      heapPush(candidateNeighbors, idx, d, i, isn);
      currentGraph[2][i][j] = 0;
    }
  }

  return candidateNeighbors;
}

exports.buildCandidates = buildCandidates;
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

exports.deheapSort = deheapSort;
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
  } else {
    return -1;
  }
}

exports.smallestFlagged = smallestFlagged;

/***/ }),

/***/ "./src/components/Utility/UMAP/index.ts":
/*!**********************************************!*\
  !*** ./src/components/Utility/UMAP/index.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var umap_1 = __webpack_require__(/*! ./umap */ "./src/components/Utility/UMAP/umap.ts");

Object.defineProperty(exports, "UMAP", {
  enumerable: true,
  get: function get() {
    return umap_1.UMAP;
  }
});

/***/ }),

/***/ "./src/components/Utility/UMAP/matrix.ts":
/*!***********************************************!*\
  !*** ./src/components/Utility/UMAP/matrix.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

var _normFns;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCSR = exports.normalize = exports.eliminateZeros = exports.multiplyScalar = exports.maximum = exports.subtract = exports.add = exports.pairwiseMultiply = exports.identity = exports.transpose = exports.SparseMatrix = void 0;

var utils = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
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
      } else {
        return defaultValue;
      }
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
          } else {
            return a.row - b.row;
          }
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

      var rows = utils.empty(this.nRows);
      var output = rows.map(function () {
        return utils.zeros(_this.nCols);
      });
      this.entries.forEach(function (value) {
        output[value.row][value.col] = value.value;
      });
      return output;
    }
  }]);

  return SparseMatrix;
}();

exports.SparseMatrix = SparseMatrix;
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

exports.transpose = transpose;
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

exports.identity = identity;
/**
 * Element-wise multiplication of two matrices
 */

function pairwiseMultiply(a, b) {
  return elementWise(a, b, function (x, y) {
    return x * y;
  });
}

exports.pairwiseMultiply = pairwiseMultiply;
/**
 * Element-wise addition of two matrices
 */

function add(a, b) {
  return elementWise(a, b, function (x, y) {
    return x + y;
  });
}

exports.add = add;
/**
 * Element-wise subtraction of two matrices
 */

function subtract(a, b) {
  return elementWise(a, b, function (x, y) {
    return x - y;
  });
}

exports.subtract = subtract;
/**
 * Element-wise maximum of two matrices
 */

function maximum(a, b) {
  return elementWise(a, b, function (x, y) {
    return x > y ? x : y;
  });
}

exports.maximum = maximum;
/**
 * Scalar multiplication of two matrices
 */

function multiplyScalar(a, scalar) {
  return a.map(function (value) {
    return value * scalar;
  });
}

exports.multiplyScalar = multiplyScalar;
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

exports.eliminateZeros = eliminateZeros;
/**
 * Normalization of a sparse matrix.
 */

function normalize(m)
/* l2 */
{
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

exports.normalize = normalize;
var normFns = (_normFns = {}, _defineProperty(_normFns, "max"
/* max */
, function max(xs) {
  var max = -Infinity;

  for (var i = 0; i < xs.length; i++) {
    max = xs[i] > max ? xs[i] : max;
  }

  return xs.map(function (x) {
    return x / max;
  });
}), _defineProperty(_normFns, "l1"
/* l1 */
, function l1(xs) {
  var sum = 0;

  for (var i = 0; i < xs.length; i++) {
    sum += xs[i];
  }

  return xs.map(function (x) {
    return x / sum;
  });
}), _defineProperty(_normFns, "l2"
/* l2 */
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
    } else {
      return a.row - b.row;
    }
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

exports.getCSR = getCSR;

/***/ }),

/***/ "./src/components/Utility/UMAP/nn_descent.ts":
/*!***************************************************!*\
  !*** ./src/components/Utility/UMAP/nn_descent.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeSearch = exports.makeInitializedNNSearch = exports.makeInitializations = exports.makeNNDescent = void 0;
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

var heap = __webpack_require__(/*! ./heap */ "./src/components/Utility/UMAP/heap.ts");

var matrix = __webpack_require__(/*! ./matrix */ "./src/components/Utility/UMAP/matrix.ts");

var tree = __webpack_require__(/*! ./tree */ "./src/components/Utility/UMAP/tree.ts");

var utils = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");
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
    var currentGraph = heap.makeHeap(data.length, nNeighbors);

    for (var i = 0; i < data.length; i++) {
      var indices = heap.rejectionSample(nNeighbors, data.length, random);

      for (var j = 0; j < indices.length; j++) {
        var d = distanceFn(data[i], data[indices[j]]);
        heap.heapPush(currentGraph, i, d, indices[j], 1);
        heap.heapPush(currentGraph, indices[j], d, i, 1);
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

            heap.heapPush(currentGraph, leafArray[n][_i], _d, leafArray[n][_j], 1);
            heap.heapPush(currentGraph, leafArray[n][_j], _d, leafArray[n][_i], 1);
          }
        }
      }
    }

    for (var _n = 0; _n < nIters; _n++) {
      var candidateNeighbors = heap.buildCandidates(currentGraph, nVertices, nNeighbors, maxCandidates, random);
      var c = 0;

      for (var _i2 = 0; _i2 < nVertices; _i2++) {
        for (var _j2 = 0; _j2 < maxCandidates; _j2++) {
          var p = Math.floor(candidateNeighbors[0][_i2][_j2]);

          if (p < 0 || utils.tauRand(random) < rho) {
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

            c += heap.heapPush(currentGraph, p, _d2, q, 1);
            c += heap.heapPush(currentGraph, q, _d2, p, 1);
          }
        }
      }

      if (c <= delta * nNeighbors * data.length) {
        break;
      }
    }

    var sorted = heap.deheapSort(currentGraph);
    return sorted;
  };
}

exports.makeNNDescent = makeNNDescent;

function makeInitializations(distanceFn) {
  function initFromRandom(nNeighbors, data, queryPoints, _heap, random) {
    for (var i = 0; i < queryPoints.length; i++) {
      var indices = utils.rejectionSample(nNeighbors, data.length, random);

      for (var j = 0; j < indices.length; j++) {
        if (indices[j] < 0) {
          continue;
        }

        var d = distanceFn(data[indices[j]], queryPoints[i]);
        heap.heapPush(_heap, i, d, indices[j], 1);
      }
    }
  }

  function initFromTree(_tree, data, queryPoints, _heap, random) {
    for (var i = 0; i < queryPoints.length; i++) {
      var indices = tree.searchFlatTree(queryPoints[i], _tree, random);

      for (var j = 0; j < indices.length; j++) {
        if (indices[j] < 0) {
          return;
        }

        var d = distanceFn(data[indices[j]], queryPoints[i]);
        heap.heapPush(_heap, i, d, indices[j], 1);
      }
    }

    return;
  }

  return {
    initFromRandom: initFromRandom,
    initFromTree: initFromTree
  };
}

exports.makeInitializations = makeInitializations;

function makeInitializedNNSearch(distanceFn) {
  return function nnSearchFn(data, graph, initialization, queryPoints) {
    var _matrix$getCSR = matrix.getCSR(graph),
        indices = _matrix$getCSR.indices,
        indptr = _matrix$getCSR.indptr;

    for (var i = 0; i < queryPoints.length; i++) {
      var tried = new Set(initialization[0][i]);

      while (true) {
        // Find smallest flagged vertex
        var vertex = heap.smallestFlagged(initialization, i);

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
            heap.uncheckedHeapPush(initialization, i, d, candidate, 1);
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

exports.makeInitializedNNSearch = makeInitializedNNSearch;

function initializeSearch(forest, data, queryPoints, nNeighbors, initFromRandom, initFromTree, random) {
  var results = heap.makeHeap(queryPoints.length, nNeighbors);
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

exports.initializeSearch = initializeSearch;

/***/ }),

/***/ "./src/components/Utility/UMAP/tree.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/tree.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchFlatTree = exports.makeLeafArray = exports.makeForest = exports.FlatTree = void 0;
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

var utils = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");

var FlatTree = function FlatTree(hyperplanes, offsets, children, indices) {
  _classCallCheck(this, FlatTree);

  this.hyperplanes = hyperplanes;
  this.offsets = offsets;
  this.children = children;
  this.indices = indices;
};

exports.FlatTree = FlatTree;
/**
 * Build a random projection forest with ``nTrees``.
 */

function makeForest(data, nNeighbors, nTrees, random) {
  var leafSize = Math.max(10, nNeighbors);
  var trees = utils.range(nTrees).map(function (_, i) {
    return makeTree(data, leafSize, i, random);
  });
  var forest = trees.map(function (tree) {
    return flattenTree(tree, leafSize);
  });
  return forest;
}

exports.makeForest = makeForest;
/**
 * Construct a random projection tree based on ``data`` with leaves
 * of size at most ``leafSize``
 */

function makeTree(data) {
  var leafSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var n = arguments.length > 2 ? arguments[2] : undefined;
  var random = arguments.length > 3 ? arguments[3] : undefined;
  var indices = utils.range(data.length);
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
    var node = {
      leftChild: leftChild,
      rightChild: rightChild,
      isLeaf: false,
      hyperplane: hyperplane,
      offset: offset
    };
    return node;
  } else {
    var _node = {
      indices: indices,
      isLeaf: true
    };
    return _node;
  }
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

  var leftIndex = utils.tauRandInt(indices.length, random);
  var rightIndex = utils.tauRandInt(indices.length, random);
  rightIndex += leftIndex === rightIndex ? 1 : 0;
  rightIndex = rightIndex % indices.length;
  var left = indices[leftIndex];
  var right = indices[rightIndex]; // Compute the normal vector to the hyperplane (the vector between the two
  // points) and the offset from the origin

  var hyperplaneOffset = 0;
  var hyperplaneVector = utils.zeros(dim);

  for (var i = 0; i < hyperplaneVector.length; i++) {
    hyperplaneVector[i] = data[left][i] - data[right][i];
    hyperplaneOffset -= hyperplaneVector[i] * (data[left][i] + data[right][i]) / 2.0;
  } // For each point compute the margin (project into normal vector)
  // If we are on lower side of the hyperplane put in one pile, otherwise
  // put it in the other pile (if we hit hyperplane on the nose, flip a coin)


  var nLeft = 0;
  var nRight = 0;
  var side = utils.zeros(indices.length);

  for (var _i = 0; _i < indices.length; _i++) {
    var margin = hyperplaneOffset;

    for (var d = 0; d < dim; d++) {
      margin += hyperplaneVector[d] * data[indices[_i]][d];
    }

    if (margin === 0) {
      side[_i] = utils.tauRandInt(2, random);

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


  var indicesLeft = utils.zeros(nLeft);
  var indicesRight = utils.zeros(nRight); // Populate the arrays with indices according to which side they fell on

  nLeft = 0;
  nRight = 0;

  for (var _i2 in utils.range(side.length)) {
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

  var hyperplanes = utils.range(nNodes).map(function () {
    return utils.zeros(tree.hyperplane ? tree.hyperplane.length : 0);
  });
  var offsets = utils.zeros(nNodes);
  var children = utils.range(nNodes).map(function () {
    return [-1, -1];
  });
  var indices = utils.range(nLeaves).map(function () {
    return utils.range(leafSize).map(function () {
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
  } else {
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
}

function numNodes(tree) {
  if (tree.isLeaf) {
    return 1;
  } else {
    return 1 + numNodes(tree.leftChild) + numNodes(tree.rightChild);
  }
}

function numLeaves(tree) {
  if (tree.isLeaf) {
    return 1;
  } else {
    return numLeaves(tree.leftChild) + numLeaves(tree.rightChild);
  }
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
  } else {
    return [[-1]];
  }
}

exports.makeLeafArray = makeLeafArray;
/**
 * Selects the side of the tree to search during flat tree search.
 */

function selectSide(hyperplane, offset, point, random) {
  var margin = offset;

  for (var d = 0; d < point.length; d++) {
    margin += hyperplane[d] * point[d];
  }

  if (margin === 0) {
    var side = utils.tauRandInt(2, random);
    return side;
  } else if (margin > 0) {
    return 0;
  } else {
    return 1;
  }
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

exports.searchFlatTree = searchFlatTree;

/***/ }),

/***/ "./src/components/Utility/UMAP/umap.ts":
/*!*********************************************!*\
  !*** ./src/components/Utility/UMAP/umap.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTransform = exports.resetLocalConnectivity = exports.fastIntersection = exports.findABParams = exports.cosine = exports.euclidean = exports.UMAP = void 0;
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

var heap = __webpack_require__(/*! ./heap */ "./src/components/Utility/UMAP/heap.ts");

var matrix = __webpack_require__(/*! ./matrix */ "./src/components/Utility/UMAP/matrix.ts");

var nnDescent = __webpack_require__(/*! ./nn_descent */ "./src/components/Utility/UMAP/nn_descent.ts");

var tree = __webpack_require__(/*! ./tree */ "./src/components/Utility/UMAP/tree.ts");

var utils = __webpack_require__(/*! ./utils */ "./src/components/Utility/UMAP/utils.ts");

var ml_levenberg_marquardt_1 = __webpack_require__(/*! ml-levenberg-marquardt */ "./node_modules/ml-levenberg-marquardt/src/index.js");

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
    /* categorical */
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
    value: function fitAsync(X, initialEmbedding) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return true;
      };
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.initializeFit(X, initialEmbedding);
                _context.next = 3;
                return this.optimizeLayoutAsync(callback);

              case 3:
                return _context.abrupt("return", this.embedding);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
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
      var _nnDescent$makeInitia = nnDescent.makeInitializations(this.distanceFn),
          initFromTree = _nnDescent$makeInitia.initFromTree,
          initFromRandom = _nnDescent$makeInitia.initFromRandom;

      this.initFromTree = initFromTree;
      this.initFromRandom = initFromRandom;
      this.search = nnDescent.makeInitializedNNSearch(this.distanceFn);
    }
  }, {
    key: "makeSearchGraph",
    value: function makeSearchGraph(X) {
      var knnIndices = this.knnIndices;
      var knnDistances = this.knnDistances;
      var dims = [X.length, X.length];
      var searchGraph = new matrix.SparseMatrix([], [], [], dims);

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

      var transpose = matrix.transpose(searchGraph);
      return matrix.maximum(searchGraph, transpose);
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
      var init = nnDescent.initializeSearch(this.rpForest, rawData, toTransform, nNeighbors, this.initFromRandom, this.initFromTree, this.random);
      var result = this.search(rawData, this.searchGraph, init, toTransform);

      var _heap$deheapSort = heap.deheapSort(result),
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
      var graph = new matrix.SparseMatrix(rows, cols, vals, size); // This was a very specially constructed graph with constant degree.
      // That lets us do fancy unpacking by reshaping the csr matrix indices
      // and data. Doing so relies on the constant degree assumption!

      var normed = matrix.normalize(graph, "l1"
      /* l1 */
      );
      var csrMatrix = matrix.getCSR(normed);
      var nPoints = toTransform.length;
      var eIndices = utils.reshape2d(csrMatrix.indices, nPoints, this.nNeighbors);
      var eWeights = utils.reshape2d(csrMatrix.values, nPoints, this.nNeighbors);
      var embedding = initTransform(eIndices, eWeights, this.embedding);
      var nEpochs = this.nEpochs ? this.nEpochs / 3 : graph.nRows <= 10000 ? 100 : 30;
      var graphMax = graph.getValues().reduce(function (max, val) {
        return val > max ? val : max;
      }, 0);
      graph = graph.map(function (value) {
        return value < graphMax / nEpochs ? 0 : value;
      });
      graph = matrix.eliminateZeros(graph);
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
        /* categorical */
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

      var metricNNDescent = nnDescent.makeNNDescent(distanceFn, this.random); // Handle python3 rounding down from 0.5 discrpancy

      var round = function round(n) {
        return n === 0.5 ? 0 : Math.round(n);
      };

      var nTrees = 5 + Math.floor(round(Math.pow(X.length, 0.5) / 20.0));
      var nIters = Math.max(5, Math.floor(Math.round(log2(X.length))));
      this.rpForest = tree.makeForest(X, nNeighbors, nTrees, this.random);
      var leafArray = tree.makeLeafArray(this.rpForest);

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
      var sparseMatrix = new matrix.SparseMatrix(rows, cols, vals, size);
      var transpose = matrix.transpose(sparseMatrix);
      var prodMatrix = matrix.pairwiseMultiply(sparseMatrix, transpose);
      var a = matrix.subtract(matrix.add(sparseMatrix, transpose), prodMatrix);
      var b = matrix.multiplyScalar(a, setOpMixRatio);
      var c = matrix.multiplyScalar(prodMatrix, 1.0 - setOpMixRatio);
      var result = matrix.add(b, c);
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
      intersection = matrix.eliminateZeros(intersection);
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
      var rho = utils.zeros(distances.length);
      var result = utils.zeros(distances.length);

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
          rho[i] = utils.max(nonZeroDists);
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
          var meanIthDistances = utils.mean(ithDistances);

          if (result[i] < MIN_K_DIST_SCALE * meanIthDistances) {
            result[i] = MIN_K_DIST_SCALE * meanIthDistances;
          }
        } else {
          var meanDistances = utils.mean(distances.map(utils.mean));

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
      var rows = utils.zeros(nSamples * nNeighbors);
      var cols = utils.zeros(nSamples * nNeighbors);
      var vals = utils.zeros(nSamples * nNeighbors);

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
        } else {
          return value;
        }
      }); // We're not computing the spectral initialization in this implementation
      // until we determine a better eigenvalue/eigenvector computation
      // approach

      if (initialEmbedding) {
        this.embedding = initialEmbedding;
      } else {
        this.embedding = utils.zeros(graph.nRows).map(function () {
          return utils.zeros(nComponents).map(function () {
            return utils.tauRand(_this3.random) * 20 + -10; // Random from -10 to 10
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
      var result = utils.filled(weights.length, -1.0);
      var max = utils.max(weights);
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
          var _k = utils.tauRandInt(nVertices, this.random);

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
        var step = function step() {
          return __awaiter(_this4, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _this$optimizationSta3, nEpochs, currentEpoch, epochCompleted, shouldStop, isFinished;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _this$optimizationSta3 = this.optimizationState, nEpochs = _this$optimizationSta3.nEpochs, currentEpoch = _this$optimizationSta3.currentEpoch;
                    this.embedding = this.optimizeLayoutStep(currentEpoch);
                    epochCompleted = this.optimizationState.currentEpoch;
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
            }, _callee2, this, [[0, 13]]);
          }));
        };

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
        var _this$optimizationSta4 = this.optimizationState,
            nEpochs = _this$optimizationSta4.nEpochs,
            currentEpoch = _this$optimizationSta4.currentEpoch;
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
      } else if (length <= 5000) {
        return 400;
      } else if (length <= 7500) {
        return 300;
      } else {
        return 200;
      }
    }
  }]);

  return UMAP;
}();

exports.UMAP = UMAP;

function euclidean(x, y) {
  var result = 0;

  for (var i = 0; i < x.length; i++) {
    result += Math.pow(x[i] - y[i], 2);
  }

  return Math.sqrt(result);
}

exports.euclidean = euclidean;

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
  } else if (normX === 0 || normY === 0) {
    return 1.0;
  } else {
    return 1.0 - result / Math.sqrt(normX * normY);
  }
}

exports.cosine = cosine;
/**
 * An interface representing the optimization state tracked between steps of
 * the SGD optimization
 */

var OptimizationState = function OptimizationState() {
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
};
/**
 * Standard clamping of a value into a fixed range
 */


function clip(x, clipValue) {
  if (x > clipValue) return clipValue;else if (x < -clipValue) return -clipValue;else return x;
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
  var curve = function curve(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        a = _ref2[0],
        b = _ref2[1];

    return function (x) {
      return 1.0 / (1.0 + a * Math.pow(x, 2 * b));
    };
  };

  var xv = utils.linear(0, spread * 3, 300).map(function (val) {
    return val < minDist ? 1.0 : val;
  });
  var yv = utils.zeros(xv.length).map(function (val, index) {
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

  var _ml_levenberg_marquar = ml_levenberg_marquardt_1.default(data, curve, options),
      parameterValues = _ml_levenberg_marquar.parameterValues;

  var _parameterValues = _slicedToArray(parameterValues, 2),
      a = _parameterValues[0],
      b = _parameterValues[1];

  return {
    a: a,
    b: b
  };
}

exports.findABParams = findABParams;
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
    } else if (target[row] !== target[col]) {
      return value * Math.exp(-farDist);
    } else {
      return value;
    }
  });
}

exports.fastIntersection = fastIntersection;
/**
 * Reset the local connectivity requirement -- each data sample should
 * have complete confidence in at least one 1-simplex in the simplicial set.
 * We can enforce this by locally rescaling confidences, and then remerging the
 * different local simplicial sets together.
 */

function resetLocalConnectivity(simplicialSet) {
  simplicialSet = matrix.normalize(simplicialSet, "max"
  /* max */
  );
  var transpose = matrix.transpose(simplicialSet);
  var prodMatrix = matrix.pairwiseMultiply(transpose, simplicialSet);
  simplicialSet = matrix.add(simplicialSet, matrix.subtract(transpose, prodMatrix));
  return matrix.eliminateZeros(simplicialSet);
}

exports.resetLocalConnectivity = resetLocalConnectivity;
/**
 * Given indices and weights and an original embeddings
 * initialize the positions of new points relative to the
 * indices and weights (of their neighbors in the source data).
 */

function initTransform(indices, weights, embedding) {
  var result = utils.zeros(indices.length).map(function (z) {
    return utils.zeros(embedding[0].length);
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

exports.initTransform = initTransform;

/***/ }),

/***/ "./src/components/Utility/UMAP/utils.ts":
/*!**********************************************!*\
  !*** ./src/components/Utility/UMAP/utils.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reshape2d = exports.rejectionSample = exports.max2d = exports.max = exports.mean = exports.sum = exports.linear = exports.ones = exports.zeros = exports.filled = exports.range = exports.empty = exports.norm = exports.tauRand = exports.tauRandInt = void 0;
/**
 * Simple random integer function
 */

function tauRandInt(n, random) {
  return Math.floor(random() * n);
}

exports.tauRandInt = tauRandInt;
/**
 * Simple random float function
 */

function tauRand(random) {
  return random();
}

exports.tauRand = tauRand;
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

exports.norm = norm;
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

exports.empty = empty;
/**
 * Creates an array filled with index values
 */

function range(n) {
  return empty(n).map(function (_, i) {
    return i;
  });
}

exports.range = range;
/**
 * Creates an array filled with a specific value
 */

function filled(n, v) {
  return empty(n).map(function () {
    return v;
  });
}

exports.filled = filled;
/**
 * Creates an array filled with zeros
 */

function zeros(n) {
  return filled(n, 0);
}

exports.zeros = zeros;
/**
 * Creates an array filled with ones
 */

function ones(n) {
  return filled(n, 1);
}

exports.ones = ones;
/**
 * Creates an array from a to b, of length len, inclusive
 */

function linear(a, b, len) {
  return empty(len).map(function (_, i) {
    return a + i * ((b - a) / (len - 1));
  });
}

exports.linear = linear;
/**
 * Returns the sum of an array
 */

function sum(input) {
  return input.reduce(function (sum, val) {
    return sum + val;
  });
}

exports.sum = sum;
/**
 * Returns the mean of an array
 */

function mean(input) {
  return sum(input) / input.length;
}

exports.mean = mean;
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

exports.max = max;
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

exports.max2d = max2d;
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

exports.rejectionSample = rejectionSample;
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

exports.reshape2d = reshape2d;

/***/ }),

/***/ "./src/components/workers/embeddings/worker_umap.ts":
/*!**********************************************************!*\
  !*** ./src/components/workers/embeddings/worker_umap.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var UMAP_1 = __webpack_require__(/*! ../../Utility/UMAP */ "./src/components/Utility/UMAP/index.ts");

__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/**
 * Worker thread that computes a stepwise projection
 */


self.addEventListener('message', function (e) {
  var context = self;

  if (e.data.messageType == 'init') {
    context.raw = e.data;
    context.umap = new UMAP_1.UMAP({
      nNeighbors: e.data.params.nNeighbors
    });
    context.umap.initializeFit(e.data.input, e.data.params.seeded ? e.data.seed : undefined);
    context.umap.step();
    context.postMessage(context.umap.getEmbedding());
  } else {
    context.umap.step();
    context.postMessage(context.umap.getEmbedding());
  }
}, false);

/***/ })

/******/ });
//# sourceMappingURL=umap.js.map