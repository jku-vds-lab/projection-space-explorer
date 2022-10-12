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

/***/ "./src/components/workers/tessy.worker.ts?raw":
/*!****************************************************!*\
  !*** ./src/components/workers/tessy.worker.ts?raw ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "\nimport worker from \"!!../../../node_modules/worker-loader/dist/runtime/inline.js\";\n\nexport default function Worker_fn() {\n  return worker(\"/******/ (() => { // webpackBootstrap\\n/******/ \\t\\\"use strict\\\";\\n/******/ \\tvar __webpack_modules__ = ({\\n\\n/***/ \\\"./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js!./src/components/workers/tessy.worker.ts?raw\\\":\\n/*!*******************************************************************************************************************************!*\\\\\\n  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js!./src/components/workers/tessy.worker.ts?raw ***!\\n  \\\\*******************************************************************************************************************************/\\n/***/ ((module) => {\\n\\nmodule.exports = \\\"import * as concaveman from 'concaveman';\\\\nimport * as libtess from 'libtess';\\\\n\\\\nvar tessy = function initTesselator() {\\\\n  // function called for each vertex of tesselator output\\\\n  function vertexCallback(data, polyVertArray) {\\\\n    // console.log(data[0], data[1]);\\\\n    polyVertArray[polyVertArray.length] = data[0];\\\\n    polyVertArray[polyVertArray.length] = data[1];\\\\n  }\\\\n\\\\n  function begincallback(type) {\\\\n    if (type !== libtess.primitiveType.GL_TRIANGLES) {\\\\n      console.log(\\\\\\\"expected TRIANGLES but got type: \\\\\\\".concat(type));\\\\n    }\\\\n  }\\\\n\\\\n  function errorcallback(errno) {\\\\n    console.log('error callback');\\\\n    console.log(\\\\\\\"error number: \\\\\\\".concat(errno));\\\\n  } // callback for when segments intersect and must be split\\\\n\\\\n\\\\n  function combinecallback(coords, data, weight) {\\\\n    // console.log('combine callback');\\\\n    return [coords[0], coords[1], coords[2]];\\\\n  }\\\\n\\\\n  function edgeCallback(flag) {// don't really care about the flag, but need no-strip/no-fan behavior\\\\n    // console.log('edge flag: ' + flag);\\\\n  }\\\\n\\\\n  var tessy = new libtess.GluTesselator(); // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);\\\\n\\\\n  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);\\\\n  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);\\\\n  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);\\\\n  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);\\\\n  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);\\\\n  return tessy;\\\\n}();\\\\n\\\\nfunction triangulate(contours) {\\\\n  // libtess will take 3d verts and flatten to a plane for tesselation\\\\n  // since only doing 2d tesselation here, provide z=1 normal to skip\\\\n  // iterating over verts only to get the same answer.\\\\n  // comment out to test normal-generation code\\\\n  tessy.gluTessNormal(0, 0, 1);\\\\n  var triangleVerts = [];\\\\n  tessy.gluTessBeginPolygon(triangleVerts);\\\\n\\\\n  for (var i = 0; i < contours.length; i++) {\\\\n    tessy.gluTessBeginContour();\\\\n    var contour = contours[i];\\\\n\\\\n    for (var j = 0; j < contour.length; j += 2) {\\\\n      var coords = [contour[j], contour[j + 1], 0];\\\\n      tessy.gluTessVertex(coords, coords);\\\\n    }\\\\n\\\\n    tessy.gluTessEndContour();\\\\n  } // finish polygon (and time triangulation process)\\\\n\\\\n\\\\n  var startTime = new Date().getTime();\\\\n  tessy.gluTessEndPolygon();\\\\n  var endTime = new Date().getTime();\\\\n  return triangleVerts;\\\\n}\\\\n/**\\\\n * @param input a list of cluster vertices\\\\n */\\\\n\\\\n\\\\nself.addEventListener('message', function (e) {\\\\n  if (e.data.messageType == 'triangulate') {\\\\n    var Y = [];\\\\n\\\\n    for (var i = 0; i < e.data.input.length; i++) {\\\\n      // Get hull of cluster\\\\n      var polygon = concaveman(e.data.input[i]); // Get triangulated hull for cluster\\\\n\\\\n      var triangulated = triangulate([polygon.flat()]);\\\\n      Y.push({\\\\n        hull: polygon,\\\\n        triangulation: triangulated\\\\n      });\\\\n    } // Get rid of typescript warning\\\\n\\\\n\\\\n    var postMessage = self.postMessage;\\\\n    postMessage(Y);\\\\n  }\\\\n});\\\\nexport default null;\\\";\\n\\n/***/ })\\n\\n/******/ \\t});\\n/************************************************************************/\\n/******/ \\t// The module cache\\n/******/ \\tvar __webpack_module_cache__ = {};\\n/******/ \\t\\n/******/ \\t// The require function\\n/******/ \\tfunction __webpack_require__(moduleId) {\\n/******/ \\t\\t// Check if module is in cache\\n/******/ \\t\\tvar cachedModule = __webpack_module_cache__[moduleId];\\n/******/ \\t\\tif (cachedModule !== undefined) {\\n/******/ \\t\\t\\treturn cachedModule.exports;\\n/******/ \\t\\t}\\n/******/ \\t\\t// Create a new module (and put it into the cache)\\n/******/ \\t\\tvar module = __webpack_module_cache__[moduleId] = {\\n/******/ \\t\\t\\t// no module.id needed\\n/******/ \\t\\t\\t// no module.loaded needed\\n/******/ \\t\\t\\texports: {}\\n/******/ \\t\\t};\\n/******/ \\t\\n/******/ \\t\\t// Execute the module function\\n/******/ \\t\\t__webpack_modules__[moduleId](module, module.exports, __webpack_require__);\\n/******/ \\t\\n/******/ \\t\\t// Return the exports of the module\\n/******/ \\t\\treturn module.exports;\\n/******/ \\t}\\n/******/ \\t\\n/************************************************************************/\\n/******/ \\t\\n/******/ \\t// startup\\n/******/ \\t// Load entry module and return exports\\n/******/ \\t// This entry module doesn't tell about it's top-level declarations so it can't be inlined\\n/******/ \\tvar __webpack_exports__ = __webpack_require__(\\\"./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js!./src/components/workers/tessy.worker.ts?raw\\\");\\n/******/ \\t\\n/******/ })()\\n;\\n\", \"Worker\", undefined, undefined);\n}\n";

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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/components/workers/tessy.worker.ts?raw");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=src_components_workers_tessy_worker_ts_raw.js.map