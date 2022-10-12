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

/***/ "./src/components/workers/embeddings/tsne.worker.ts":
/*!**********************************************************!*\
  !*** ./src/components/workers/embeddings/tsne.worker.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utility_UMAP_umap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utility/UMAP/umap */ "./src/components/Utility/UMAP/umap.ts");
/* harmony import */ var _Utility_DistanceFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utility/DistanceFunctions */ "./src/components/Utility/DistanceFunctions.ts");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



 // create main global object

var tsnejs = tsnejs || {
  REVISION: 'ALPHA'
};

(function (global) {
  // utility function
  var assert = function assert(condition, message) {
    if (!condition) {
      throw message || 'Assertion failed';
    }
  }; // syntax sugar


  var getopt = function getopt(opt, field, defaultval) {
    if (opt.hasOwnProperty(field)) {
      return opt[field];
    }

    return defaultval;
  }; // return 0 mean unit standard deviation random number


  var return_v = false;
  var v_val = 0.0;

  var gaussRandom = function gaussRandom() {
    if (return_v) {
      return_v = false;
      return v_val;
    }

    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2 * Math.log(r) / r);
    v_val = v * c; // cache this for next function call for efficiency

    return_v = true;
    return u * c;
  }; // return random normal number


  var randn = function randn(mu, std) {
    return mu + gaussRandom() * std;
  }; // utilitity that creates contiguous vector of zeros of size n


  var zeros = function zeros(n) {
    if (typeof n === 'undefined' || isNaN(n)) {
      return [];
    }

    if (typeof ArrayBuffer === 'undefined') {
      // lacking browser support
      var arr = new Array(n);

      for (var i = 0; i < n; i++) {
        arr[i] = 0;
      }

      return arr;
    }

    return new Float64Array(n); // typed arrays are faster
  }; // utility that returns 2d array filled with random numbers
  // or with value s, if provided


  var randn2d = function randn2d(n, d, s) {
    var uses = typeof s !== 'undefined';
    var x = [];

    for (var i = 0; i < n; i++) {
      var xhere = [];

      for (var j = 0; j < d; j++) {
        if (uses) {
          xhere.push(s);
        } else {
          xhere.push(randn(0.0, 1e-4));
        }
      }

      x.push(xhere);
    }

    return x;
  }; // compute L2 distance between two vectors


  var L2 = function L2(x1, x2) {
    var D = x1.length;
    var d = 0;

    for (var i = 0; i < D; i++) {
      var x1i = x1[i];
      var x2i = x2[i];
      d += (x1i - x2i) * (x1i - x2i);
    }

    return d;
  }; // compute pairwise distance in all vectors in X


  var xtod = function xtod(X, distanceFn) {
    var N = X.length;
    var dist = zeros(N * N); // allocate contiguous array

    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var d = distanceFn(X[i], X[j]);
        dist[i * N + j] = d;
        dist[j * N + i] = d;
      }
    }

    return dist;
  }; // compute (p_{i|j} + p_{j|i})/(2n)


  var d2p = function d2p(D, perplexity, tol) {
    var Nf = Math.sqrt(D.length); // this better be an integer

    var N = Math.floor(Nf);
    assert(N === Nf, 'D should have square number of elements.');
    var Htarget = Math.log(perplexity); // target entropy of distribution

    var P = zeros(N * N); // temporary probability matrix

    var prow = zeros(N); // a temporary storage compartment

    for (var i = 0; i < N; i++) {
      var betamin = -Infinity;
      var betamax = Infinity;
      var beta = 1; // initial value of precision

      var done = false;
      var maxtries = 50; // perform binary search to find a suitable precision beta
      // so that the entropy of the distribution is appropriate

      var num = 0;

      while (!done) {
        // debugger;
        // compute entropy and kernel row with beta precision
        var psum = 0.0;

        for (var j = 0; j < N; j++) {
          var pj = Math.exp(-D[i * N + j] * beta);

          if (i === j) {
            pj = 0;
          } // we dont care about diagonals


          prow[j] = pj;
          psum += pj;
        } // normalize p and compute entropy


        var Hhere = 0.0;

        for (var j = 0; j < N; j++) {
          if (psum == 0) {
            var pj = 0;
          } else {
            var pj = prow[j] / psum;
          }

          prow[j] = pj;
          if (pj > 1e-7) Hhere -= pj * Math.log(pj);
        } // adjust beta based on result


        if (Hhere > Htarget) {
          // entropy was too high (distribution too diffuse)
          // so we need to increase the precision for more peaky distribution
          betamin = beta; // move up the bounds

          if (betamax === Infinity) {
            beta *= 2;
          } else {
            beta = (beta + betamax) / 2;
          }
        } else {
          // converse case. make distrubtion less peaky
          betamax = beta;

          if (betamin === -Infinity) {
            beta /= 2;
          } else {
            beta = (beta + betamin) / 2;
          }
        } // stopping conditions: too many tries or got a good precision


        num++;

        if (Math.abs(Hhere - Htarget) < tol) {
          done = true;
        }

        if (num >= maxtries) {
          done = true;
        }
      } // console.log('data point ' + i + ' gets precision ' + beta + ' after ' + num + ' binary search steps.');
      // copy over the final prow to P at row i


      for (var j = 0; j < N; j++) {
        P[i * N + j] = prow[j];
      }
    } // end loop over examples i
    // symmetrize P and normalize it to sum to 1 over all ij


    var Pout = zeros(N * N);
    var N2 = N * 2;

    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        Pout[i * N + j] = Math.max((P[i * N + j] + P[j * N + i]) / N2, 1e-100);
      }
    }

    return Pout;
  }; // helper function


  function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }

  var tSNE = function tSNE(opt) {
    var opt = opt || {};
    this.perplexity = getopt(opt, 'perplexity', 30); // effective number of nearest neighbors

    this.dim = getopt(opt, 'dim', 2); // by default 2-D tSNE

    this.epsilon = getopt(opt, 'epsilon', 10); // learning rate

    this.distanceFn = getopt(opt, 'distanceFn', _Utility_UMAP_umap__WEBPACK_IMPORTED_MODULE_1__.euclidean);
    this.iter = 0;
  };

  tSNE.prototype = {
    // this function takes a set of high-dimensional points
    // and creates matrix P from them using gaussian kernel
    initDataRaw: function initDataRaw(X) {
      var N = X.length;
      var D = X[0].length;
      assert(N > 0, ' X is empty? You must have some data!');
      assert(D > 0, ' X[0] is empty? Where is the data?');
      var dists = xtod(X, this.distanceFn); // convert X to distances using gaussian kernel

      this.P = d2p(dists, this.perplexity, 1e-4); // attach to object

      this.N = N; // back up the size of the dataset

      this.initSolution(); // refresh this
    },
    initDataSeeded: function initDataSeeded(X, seed) {
      var N = X.length;
      var D = X[0].length;
      assert(N > 0, ' X is empty? You must have some data!');
      assert(D > 0, ' X[0] is empty? Where is the data?');
      var dists = xtod(X, this.distanceFn); // convert X to distances using gaussian kernel

      this.P = d2p(dists, this.perplexity, 1e-4); // attach to object

      this.N = N; // back up the size of the dataset
      // generate random solution to t-SNE

      if (seed) {
        var maxX = Math.max.apply(Math, _toConsumableArray(seed.map(function (s) {
          return s[0];
        })));
        var minX = Math.min.apply(Math, _toConsumableArray(seed.map(function (s) {
          return s[0];
        })));
        var maxY = Math.max.apply(Math, _toConsumableArray(seed.map(function (s) {
          return s[1];
        })));
        var minY = Math.min.apply(Math, _toConsumableArray(seed.map(function (s) {
          return s[1];
        })));
        var abs = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));
        var result = [];

        for (var i = 0; i < this.N; i++) {
          result.push([seed[i][0] / abs / 1000, seed[i][1] / abs / 1000]);
        }

        this.Y = result;
      } else {
        this.Y = randn2d(this.N, this.dim, undefined); // the solution
      }

      this.gains = randn2d(this.N, this.dim, 1.0); // step gains to accelerate progress in unchanging directions

      this.ystep = randn2d(this.N, this.dim, 0.0); // momentum accumulator

      this.iter = 0;
    },
    // this function takes a given distance matrix and creates
    // matrix P from them.
    // D is assumed to be provided as a list of lists, and should be symmetric
    initDataDist: function initDataDist(D) {
      var N = D.length;
      assert(N > 0, ' X is empty? You must have some data!'); // convert D to a (fast) typed array version

      var dists = zeros(N * N); // allocate contiguous array

      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var d = D[i][j];
          dists[i * N + j] = d;
          dists[j * N + i] = d;
        }
      }

      this.P = d2p(dists, this.perplexity, 1e-4);
      this.N = N;
      this.initSolution(); // refresh this
    },
    // (re)initializes the solution to random
    initSolution: function initSolution() {
      // generate random solution to t-SNE
      this.Y = randn2d(this.N, this.dim, undefined); // the solution

      this.gains = randn2d(this.N, this.dim, 1.0); // step gains to accelerate progress in unchanging directions

      this.ystep = randn2d(this.N, this.dim, 0.0); // momentum accumulator

      this.iter = 0;
    },
    // return pointer to current solution
    getSolution: function getSolution() {
      return this.Y;
    },
    // perform a single step of optimization to improve the embedding
    step: function step() {
      this.iter += 1;
      var N = this.N;
      var cg = this.costGrad(this.Y); // evaluate gradient

      var cost = cg.cost;
      var grad = cg.grad; // perform gradient step

      var ymean = zeros(this.dim);

      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          var gid = grad[i][d];
          var sid = this.ystep[i][d];
          var gainid = this.gains[i][d]; // compute gain update

          var newgain = sign(gid) === sign(sid) ? gainid * 0.8 : gainid + 0.2;
          if (newgain < 0.01) newgain = 0.01; // clamp

          this.gains[i][d] = newgain; // store for next turn
          // compute momentum step direction

          var momval = this.iter < 250 ? 0.5 : 0.8;
          var newsid = momval * sid - this.epsilon * newgain * grad[i][d];
          this.ystep[i][d] = newsid; // remember the step we took
          // step!

          this.Y[i][d] += newsid;
          ymean[d] += this.Y[i][d]; // accumulate mean so that we can center later
        }
      } // reproject Y to be zero mean


      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          this.Y[i][d] -= ymean[d] / N;
        }
      } // if(this.iter%100===0) console.log('iter ' + this.iter + ', cost: ' + cost);


      return cost; // return current cost
    },
    // for debugging: gradient check
    debugGrad: function debugGrad() {
      var N = this.N;
      var cg = this.costGrad(this.Y); // evaluate gradient

      var cost = cg.cost;
      var grad = cg.grad;
      var e = 1e-5;

      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          var yold = this.Y[i][d];
          this.Y[i][d] = yold + e;
          var cg0 = this.costGrad(this.Y);
          this.Y[i][d] = yold - e;
          var cg1 = this.costGrad(this.Y);
          var analytic = grad[i][d];
          var numerical = (cg0.cost - cg1.cost) / (2 * e);
          this.Y[i][d] = yold;
        }
      }
    },
    // return cost and gradient, given an arrangement
    costGrad: function costGrad(Y) {
      var N = this.N;
      var dim = this.dim; // dim of output space

      var P = this.P;
      var pmul = this.iter < 100 ? 4 : 1; // trick that helps with local optima
      // compute current Q distribution, unnormalized first

      var Qu = zeros(N * N);
      var qsum = 0.0;

      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var dsum = 0.0;

          for (var d = 0; d < dim; d++) {
            var dhere = Y[i][d] - Y[j][d];
            dsum += dhere * dhere;
          }

          var qu = 1.0 / (1.0 + dsum); // Student t-distribution

          Qu[i * N + j] = qu;
          Qu[j * N + i] = qu;
          qsum += 2 * qu;
        }
      } // normalize Q distribution to sum to 1


      var NN = N * N;
      var Q = zeros(NN);

      for (var q = 0; q < NN; q++) {
        Q[q] = Math.max(Qu[q] / qsum, 1e-100);
      }

      var cost = 0.0;
      var grad = [];

      for (var i = 0; i < N; i++) {
        var gsum = new Array(dim); // init grad for point i

        for (var d = 0; d < dim; d++) {
          gsum[d] = 0.0;
        }

        for (var j = 0; j < N; j++) {
          cost += -P[i * N + j] * Math.log(Q[i * N + j]); // accumulate cost (the non-constant portion at least...)

          var premult = 4 * (pmul * P[i * N + j] - Q[i * N + j]) * Qu[i * N + j];

          for (var d = 0; d < dim; d++) {
            gsum[d] += premult * (Y[i][d] - Y[j][d]);
          }
        }

        grad.push(gsum);
      }

      return {
        cost: cost,
        grad: grad
      };
    }
  };
  global.tSNE = tSNE; // export tSNE class
})(tsnejs);
/**
 * Worker thread that computes a stepwise projection
 */


self.addEventListener('message', function (e) {
  var context = self;

  if (e.data.messageType == 'init') {
    context.raw = e.data;
    context.tsne = new tsnejs.tSNE({
      epsilon: e.data.params.learningRate,
      perplexity: e.data.params.perplexity,
      dim: 2,
      distanceFn: (0,_Utility_DistanceFunctions__WEBPACK_IMPORTED_MODULE_2__.get_distance_fn)(e.data.params.distanceMetric, e)
    });
    context.tsne.initDataSeeded(e.data.input, e.data.params.seeded ? e.data.seed : undefined);
    context.tsne.step();
    context.postMessage(context.tsne.getSolution());
  } else if (context.tsne != null) {
    context.tsne.step();
    context.postMessage(context.tsne.getSolution());
  }
}, false);

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_jaccard_jaccard_js-node_modules_ml-levenberg-marquardt_src_index_js-node-e431cd","src_components_Utility_DistanceFunctions_ts-src_components_Utility_UMAP_umap_ts"], () => (__webpack_require__("./src/components/workers/embeddings/tsne.worker.ts")))
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
/******/ 			"src_components_workers_embeddings_tsne_worker_ts": 1
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
/******/ 			return Promise.all([
/******/ 				__webpack_require__.e("vendors-node_modules_jaccard_jaccard_js-node_modules_ml-levenberg-marquardt_src_index_js-node-e431cd"),
/******/ 				__webpack_require__.e("src_components_Utility_DistanceFunctions_ts-src_components_Utility_UMAP_umap_ts")
/******/ 			]).then(next);
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
//# sourceMappingURL=src_components_workers_embeddings_tsne_worker_ts.js.map