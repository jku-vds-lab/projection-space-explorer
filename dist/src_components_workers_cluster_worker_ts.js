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

/***/ "./src/components/workers/cluster.worker.ts":
/*!**************************************************!*\
  !*** ./src/components/workers/cluster.worker.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var concaveman__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! concaveman */ "./node_modules/concaveman/index.js");
/* harmony import */ var concaveman__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(concaveman__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var libtess__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libtess */ "./node_modules/libtess/libtess.min.js");
/* harmony import */ var libtess__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(libtess__WEBPACK_IMPORTED_MODULE_1__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable no-restricted-globals */

 // eslint-disable-next-line @typescript-eslint/no-unused-vars

var ctx = self;

var tessy = function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    // console.log(data[0], data[1]);
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
  }

  function begincallback(type) {
    if (type !== libtess__WEBPACK_IMPORTED_MODULE_1__.primitiveType.GL_TRIANGLES) {
      console.log("expected TRIANGLES but got type: ".concat(type));
    }
  }

  function errorcallback(errno) {
    console.log('error callback');
    console.log("error number: ".concat(errno));
  } // callback for when segments intersect and must be split


  function combinecallback(coords) {
    // console.log('combine callback');
    return [coords[0], coords[1], coords[2]];
  }

  function edgeCallback() {// don't really care about the flag, but need no-strip/no-fan behavior
    // console.log('edge flag: ' + flag);
  }

  var tessy = new libtess__WEBPACK_IMPORTED_MODULE_1__.GluTesselator(); // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);

  tessy.gluTessCallback(libtess__WEBPACK_IMPORTED_MODULE_1__.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess__WEBPACK_IMPORTED_MODULE_1__.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess__WEBPACK_IMPORTED_MODULE_1__.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess__WEBPACK_IMPORTED_MODULE_1__.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess__WEBPACK_IMPORTED_MODULE_1__.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);
  return tessy;
}();

function triangulate(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  tessy.gluTessNormal(0, 0, 1);
  var triangleVerts = [];
  tessy.gluTessBeginPolygon(triangleVerts);

  for (var i = 0; i < contours.length; i++) {
    tessy.gluTessBeginContour();
    var contour = contours[i];

    for (var j = 0; j < contour.length; j += 2) {
      var coords = [contour[j], contour[j + 1], 0];
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
  var clusters = {};
  raw.forEach(function (entry, index) {
    var x = xy[index][0];
    var y = xy[index][1];

    var _entry = _slicedToArray(entry, 3),
        label = _entry[0],
        probability = _entry[1],
        score = _entry[2];

    if (!(label in clusters)) {
      clusters[label] = {
        points: []
      };
    }

    clusters[label].points.push({
      label: label,
      probability: probability,
      meshIndex: index,
      x: x,
      y: y,
      score: score
    });
  });
  return clusters;
}

function validKey(key) {
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
    var clusters = {};
    e.data.message.forEach(function (vector, index) {
      var _vector = _slicedToArray(vector, 3),
          x = _vector[0],
          y = _vector[1],
          labels = _vector[2];

      labels.forEach(function (label) {
        // If we have a new
        if (!(label in clusters)) {
          clusters[label] = {
            points: []
          };
        }

        clusters[label].points.push({
          label: label,
          probability: 1.0,
          meshIndex: index,
          x: x,
          y: y
        });
      });
    });
    Object.keys(clusters).forEach(function (key) {
      if (!validKey(key)) return;
      var cluster = clusters[key];
      var bounds = {
        minX: 10000,
        maxX: -10000,
        minY: 10000,
        maxY: -10000
      };
      var pts = cluster.points.map(function (point) {
        var x = point.x;
        var y = point.y;
        if (x < bounds.minX) bounds.minX = x;
        if (x > bounds.maxX) bounds.maxX = x;
        if (y < bounds.minY) bounds.minY = y;
        if (y > bounds.maxY) bounds.maxY = y;
        return [x, y];
      }); // Get hull of cluster

      var polygon = concaveman__WEBPACK_IMPORTED_MODULE_0__(pts); // Get triangulated hull for cluster

      var triangulated = triangulate([polygon.flat()]);
      cluster.hull = polygon;
      cluster.triangulation = triangulated;
    });
    var context = self;
    context.postMessage(clusters);
  }
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
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_concaveman_index_js-node_modules_libtess_libtess_min_js"], () => (__webpack_require__("./src/components/workers/cluster.worker.ts")))
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
/******/ 			"src_components_workers_cluster_worker_ts": 1
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
/******/ 			return __webpack_require__.e("vendors-node_modules_concaveman_index_js-node_modules_libtess_libtess_min_js").then(next);
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
//# sourceMappingURL=src_components_workers_cluster_worker_ts.js.map