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

/***/ "./src/components/workers/embeddings/umap.worker.ts?inline":
/*!*****************************************************************!*\
  !*** ./src/components/workers/embeddings/umap.worker.ts?inline ***!
  \*****************************************************************/
/***/ ((module) => {

module.exports = "data:video/mp2t;base64,CmltcG9ydCB3b3JrZXIgZnJvbSAiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvd29ya2VyLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5saW5lLmpzIjsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdvcmtlcl9mbigpIHsKICByZXR1cm4gd29ya2VyKCIvKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX21vZHVsZXNfXyA9ICh7XG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanMhLi9zcmMvY29tcG9uZW50cy93b3JrZXJzL2VtYmVkZGluZ3MvdW1hcC53b3JrZXIudHM/aW5saW5lXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzIS4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcyEuL3NyYy9jb21wb25lbnRzL3dvcmtlcnMvZW1iZWRkaW5ncy91bWFwLndvcmtlci50cz9pbmxpbmUgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKChtb2R1bGUpID0+IHtcblxubW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6dmlkZW8vbXAydDtiYXNlNjQsYVcxd2IzSjBJSHNnVlUxQlVDQjlJR1p5YjIwZ0p5NHVMeTR1TDFWMGFXeHBkSGt2VlUxQlVDYzdDbWx0Y0c5eWRDQW5jbVZuWlc1bGNtRjBiM0l0Y25WdWRHbHRaUzl5ZFc1MGFXMWxKenNLYVcxd2IzSjBJSHNnWjJWMFgyUnBjM1JoYm1ObFgyWnVJSDBnWm5KdmJTQW5MaTR2TGk0dlZYUnBiR2wwZVM5RWFYTjBZVzVqWlVaMWJtTjBhVzl1Y3ljN0NpOHFLZ29nS2lCWGIzSnJaWElnZEdoeVpXRmtJSFJvWVhRZ1kyOXRjSFYwWlhNZ1lTQnpkR1Z3ZDJselpTQndjbTlxWldOMGFXOXVDaUFxTHdvS2MyVnNaaTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R0WlhOellXZGxKeXdnWm5WdVkzUnBiMjRnS0dVcElIc0tJQ0IyWVhJZ1kyOXVkR1Y0ZENBOUlITmxiR1k3Q2dvZ0lHbG1JQ2hsTG1SaGRHRXViV1Z6YzJGblpWUjVjR1VnUFQwZ0oybHVhWFFuS1NCN0NpQWdJQ0JqYjI1MFpYaDBMbkpoZHlBOUlHVXVaR0YwWVRzS0lDQWdJR052Ym5SbGVIUXVkVzFoY0NBOUlHNWxkeUJWVFVGUUtIc0tJQ0FnSUNBZ2JrNWxhV2RvWW05eWN6b2daUzVrWVhSaExuQmhjbUZ0Y3k1dVRtVnBaMmhpYjNKekxBb2dJQ0FnSUNCa2FYTjBZVzVqWlVadU9pQm5aWFJmWkdsemRHRnVZMlZmWm00b1pTNWtZWFJoTG5CaGNtRnRjeTVrYVhOMFlXNWpaVTFsZEhKcFl5d2daU2tLSUNBZ0lIMHBPd29nSUNBZ1kyOXVkR1Y0ZEM1MWJXRndMbWx1YVhScFlXeHBlbVZHYVhRb1pTNWtZWFJoTG1sdWNIVjBMQ0JsTG1SaGRHRXVjR0Z5WVcxekxuTmxaV1JsWkNBL0lHVXVaR0YwWVM1elpXVmtJRG9nZFc1a1pXWnBibVZrS1RzS0lDQWdJR052Ym5SbGVIUXVkVzFoY0M1emRHVndLQ2s3Q2lBZ0lDQmpiMjUwWlhoMExuQnZjM1JOWlhOellXZGxLR052Ym5SbGVIUXVkVzFoY0M1blpYUkZiV0psWkdScGJtY29LU2s3Q2lBZ2ZTQmxiSE5sSUhzS0lDQWdJR052Ym5SbGVIUXVkVzFoY0M1emRHVndLQ2s3Q2lBZ0lDQmpiMjUwWlhoMExuQnZjM1JOWlhOellXZGxLR052Ym5SbGVIUXVkVzFoY0M1blpYUkZiV0psWkdScGJtY29LU2s3Q2lBZ2ZRcDlMQ0JtWVd4elpTazdDbVY0Y0c5eWRDQmtaV1poZFd4MElHNTFiR3c3XCI7XG5cbi8qKiovIH0pXG5cbi8qKioqKiovIFx0fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBzdGFydHVwXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBkb2Vzbid0IHRlbGwgYWJvdXQgaXQncyB0b3AtbGV2ZWwgZGVjbGFyYXRpb25zIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy90cy1sb2FkZXIvaW5kZXguanMhLi9zcmMvY29tcG9uZW50cy93b3JrZXJzL2VtYmVkZGluZ3MvdW1hcC53b3JrZXIudHM/aW5saW5lXCIpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIH0pKClcbjtcbiIsICJXb3JrZXIiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7Cn0K";

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/components/workers/embeddings/umap.worker.ts?inline");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=src_components_workers_embeddings_umap_worker_ts_inline.js.map