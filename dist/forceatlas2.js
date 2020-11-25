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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/components/workers/embeddings/worker_forceatlas2.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/graphology/dist/graphology.umd.min.js":
/*!************************************************************!*\
  !*** ./node_modules/graphology/dist/graphology.umd.min.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function n(e){return(n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function o(e,t,n){return(o=i()?Reflect.construct:function(e,t,n){var i=[null];i.push.apply(i,t);var o=new(Function.bind.apply(e,i));return n&&r(o,n.prototype),o}).apply(null,arguments)}function a(e){var t="function"==typeof Map?new Map:void 0;return(a=function(e){if(null===e||(i=e,-1===Function.toString.call(i).indexOf("[native code]")))return e;var i;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,a)}function a(){return o(e,arguments,n(this).constructor)}return a.prototype=Object.create(e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,e)})(e)}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(){for(var e=arguments[0]||{},t=1,n=arguments.length;t<n;t++)if(arguments[t])for(var r in arguments[t])e[r]=arguments[t][r];return e}function u(e,t,n,r){var i=e._nodes.get(t),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function s(t){return null!==t&&"object"===e(t)&&"function"==typeof t.addUndirectedEdgeWithKey&&"function"==typeof t.dropNode}function h(t){return"object"===e(t)&&null!==t&&t.constructor===Object}function f(e){for(var t=""+e,n="",r=0,i=t.length;r<i;r++){n=t[i-r-1]+n,(r-2)%3||r===i-1||(n=","+n)}return n}function p(e,t,n){Object.defineProperty(e,t,{enumerable:!1,configurable:!1,writable:!0,value:n})}function g(e,t,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(e,t,r)}function l(){}function y(){y.init.call(this)}function v(e){return void 0===e._maxListeners?y.defaultMaxListeners:e._maxListeners}function w(e,t,n){if(t)e.call(n);else for(var r=e.length,i=S(e,r),o=0;o<r;++o)i[o].call(n)}function b(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,o=S(e,i),a=0;a<i;++a)o[a].call(n,r)}function m(e,t,n,r,i){if(t)e.call(n,r,i);else for(var o=e.length,a=S(e,o),c=0;c<o;++c)a[c].call(n,r,i)}function _(e,t,n,r,i,o){if(t)e.call(n,r,i,o);else for(var a=e.length,c=S(e,a),d=0;d<a;++d)c[d].call(n,r,i,o)}function G(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,o=S(e,i),a=0;a<i;++a)o[a].apply(n,r)}function E(e,t,n,r){var i,o,a,c;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((o=e._events)?(o.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),o=e._events),a=o[t]):(o=e._events=new l,e._eventsCount=0),a){if("function"==typeof a?a=o[t]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),!a.warned&&(i=v(e))&&i>0&&a.length>i){a.warned=!0;var d=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+t+" listeners added. Use emitter.setMaxListeners() to increase limit");d.name="MaxListenersExceededWarning",d.emitter=e,d.type=t,d.count=a.length,c=d,"function"==typeof console.warn?console.warn(c):console.log(c)}}else a=o[t]=n,++e._eventsCount;return e}function k(e,t,n){var r=!1;function i(){e.removeListener(t,i),r||(r=!0,n.apply(e,arguments))}return i.listener=n,i}function x(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function S(e,t){for(var n=new Array(t);t--;)n[t]=e[t];return n}function A(e){Object.defineProperty(this,"_next",{writable:!1,enumerable:!1,value:e}),this.done=!1}l.prototype=Object.create(null),y.EventEmitter=y,y.usingDomains=!1,y.prototype.domain=void 0,y.prototype._events=void 0,y.prototype._maxListeners=void 0,y.defaultMaxListeners=10,y.init=function(){this.domain=null,y.usingDomains&&(void 0).active,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new l,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},y.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},y.prototype.getMaxListeners=function(){return v(this)},y.prototype.emit=function(e){var t,n,r,i,o,a,c,d="error"===e;if(a=this._events)d=d&&null==a.error;else if(!d)return!1;if(c=this.domain,d){if(t=arguments[1],!c){if(t instanceof Error)throw t;var u=new Error('Uncaught, unspecified "error" event. ('+t+")");throw u.context=t,u}return t||(t=new Error('Uncaught, unspecified "error" event')),t.domainEmitter=this,t.domain=c,t.domainThrown=!1,c.emit("error",t),!1}if(!(n=a[e]))return!1;var s="function"==typeof n;switch(r=arguments.length){case 1:w(n,s,this);break;case 2:b(n,s,this,arguments[1]);break;case 3:m(n,s,this,arguments[1],arguments[2]);break;case 4:_(n,s,this,arguments[1],arguments[2],arguments[3]);break;default:for(i=new Array(r-1),o=1;o<r;o++)i[o-1]=arguments[o];G(n,s,this,i)}return!0},y.prototype.addListener=function(e,t){return E(this,e,t,!1)},y.prototype.on=y.prototype.addListener,y.prototype.prependListener=function(e,t){return E(this,e,t,!0)},y.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,k(this,e,t)),this},y.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,k(this,e,t)),this},y.prototype.removeListener=function(e,t){var n,r,i,o,a;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(r=this._events))return this;if(!(n=r[e]))return this;if(n===t||n.listener&&n.listener===t)0==--this._eventsCount?this._events=new l:(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length;o-- >0;)if(n[o]===t||n[o].listener&&n[o].listener===t){a=n[o].listener,i=o;break}if(i<0)return this;if(1===n.length){if(n[0]=void 0,0==--this._eventsCount)return this._events=new l,this;delete r[e]}else!function(e,t){for(var n=t,r=n+1,i=e.length;r<i;n+=1,r+=1)e[n]=e[r];e.pop()}(n,i);r.removeListener&&this.emit("removeListener",e,a||t)}return this},y.prototype.removeAllListeners=function(e){var t,n;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=new l,this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=new l:delete n[e]),this;if(0===arguments.length){for(var r,i=Object.keys(n),o=0;o<i.length;++o)"removeListener"!==(r=i[o])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=new l,this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)do{this.removeListener(e,t[t.length-1])}while(t[0]);return this},y.prototype.listeners=function(e){var t,n=this._events;return n&&(t=n[e])?"function"==typeof t?[t.listener||t]:function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(t):[]},y.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):x.call(e,t)},y.prototype.listenerCount=x,y.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]},A.prototype.next=function(){if(this.done)return{done:!0};var e=this._next();return e.done&&(this.done=!0),e},"undefined"!=typeof Symbol&&(A.prototype[Symbol.iterator]=function(){return this}),A.of=function(){var e=arguments,t=e.length,n=0;return new A((function(){return n>=t?{done:!0}:{done:!1,value:e[n++]}}))},A.empty=function(){var e=new A(null);return e.done=!0,e},A.is=function(e){return e instanceof A||"object"==typeof e&&null!==e&&"function"==typeof e.next};var N=A,D=function(e,t){for(var n,r=arguments.length>1?t:1/0,i=r!==1/0?new Array(r):[],o=0;;){if(o===r)return i;if((n=e.next()).done)return o!==t?i.slice(0,o):i;i[o++]=n.value}},L=function(e){function n(t,n){var r;return(r=e.call(this)||this).name="GraphError",r.message=t||"",r.data=n||{},r}return t(n,e),n}(a(Error)),j=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(i),n.prototype.constructor),i}return t(n,e),n}(L),U=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(i),n.prototype.constructor),i}return t(n,e),n}(L),z=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(i),n.prototype.constructor),i}return t(n,e),n}(L);function O(e,t){this.key=e,this.attributes=t,this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.directedSelfLoops=0,this.undirectedSelfLoops=0,this.in={},this.out={},this.undirected={}}function K(e,t){this.key=e,this.attributes=t||{},this.inDegree=0,this.outDegree=0,this.directedSelfLoops=0,this.in={},this.out={}}function M(e,t){this.key=e,this.attributes=t||{},this.undirectedDegree=0,this.undirectedSelfLoops=0,this.undirected={}}function C(e,t,n,r,i){this.key=e,this.attributes=i,this.source=n,this.target=r,this.generatedKey=t}function T(e,t,n,r,i){this.key=e,this.attributes=i,this.source=n,this.target=r,this.generatedKey=t}function P(e,t,n,r,i,o,a){var c=e.multi,d=t?"undirected":"out",u=t?"undirected":"in",s=o[d][i];void 0===s&&(s=c?new Set:n,o[d][i]=s),c&&s.add(n),r!==i&&void 0===a[u][r]&&(a[u][r]=s)}function W(e,t,n){var r=e.multi,i=n.source,o=n.target,a=i.key,c=o.key,d=i[t?"undirected":"out"],u=t?"undirected":"in";if(c in d)if(r){var s=d[c];1===s.size?(delete d[c],delete o[u][a]):s.delete(n)}else delete d[c];r||delete o[u][a]}K.prototype.upgradeToMixed=function(){this.undirectedDegree=0,this.undirectedSelfLoops=0,this.undirected={}},M.prototype.upgradeToMixed=function(){this.inDegree=0,this.outDegree=0,this.directedSelfLoops=0,this.in={},this.out={}};var R=[{name:function(e){return"get".concat(e,"Attribute")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,c=""+i;if(i=arguments[2],!(o=u(this,a,c,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&!(o instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return o.attributes[i]}}},{name:function(e){return"get".concat(e,"Attributes")},attacher:function(e,t,n,r){e.prototype[t]=function(e){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+arguments[1];if(!(i=u(this,o,a,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&!(i instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return i.attributes}}},{name:function(e){return"has".concat(e,"Attribute")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,c=""+i;if(i=arguments[2],!(o=u(this,a,c,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&!(o instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return o.attributes.hasOwnProperty(i)}}},{name:function(e){return"set".concat(e,"Attribute")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i,o){var a;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var c=""+e,d=""+i;if(i=arguments[2],o=arguments[3],!(a=u(this,c,d,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(c,'" - "').concat(d,'").'))}else if(e=""+e,!(a=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&!(a instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return a.attributes[i]=o,this.emit("edgeAttributesUpdated",{key:a.key,type:"set",meta:{name:i,value:o}}),this}}},{name:function(e){return"update".concat(e,"Attribute")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i,o){var a;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var c=""+e,d=""+i;if(i=arguments[2],o=arguments[3],!(a=u(this,c,d,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(c,'" - "').concat(d,'").'))}else if(e=""+e,!(a=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("function"!=typeof o)throw new j("Graph.".concat(t,": updater should be a function."));if("mixed"!==n&&!(a instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return a.attributes[i]=o(a.attributes[i]),this.emit("edgeAttributesUpdated",{key:a.key,type:"set",meta:{name:i,value:a.attributes[i]}}),this}}},{name:function(e){return"remove".concat(e,"Attribute")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,c=""+i;if(i=arguments[2],!(o=u(this,a,c,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&!(o instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return delete o.attributes[i],this.emit("edgeAttributesUpdated",{key:o.key,type:"remove",meta:{name:i}}),this}}},{name:function(e){return"replace".concat(e,"Attributes")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,c=""+i;if(i=arguments[2],!(o=u(this,a,c,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if(!h(i))throw new j("Graph.".concat(t,": provided attributes are not a plain object."));if("mixed"!==n&&!(o instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));var d=o.attributes;return o.attributes=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"replace",meta:{before:d,after:i}}),this}}},{name:function(e){return"merge".concat(e,"Attributes")},attacher:function(e,t,n,r){e.prototype[t]=function(e,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new z("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new z("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,c=""+i;if(i=arguments[2],!(o=u(this,a,c,n)))throw new U("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if(!h(i))throw new j("Graph.".concat(t,": provided attributes are not a plain object."));if("mixed"!==n&&!(o instanceof r))throw new U("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return d(o.attributes,i),this.emit("edgeAttributesUpdated",{key:o.key,type:"merge",meta:{data:i}}),this}}}];var I=function(){var e,t=arguments,n=-1;return new N((function r(){if(!e){if(++n>=t.length)return{done:!0};e=t[n]}var i=e.next();return i.done?(e=null,r()):i}))},F=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function Y(e,t){for(var n in t)t[n]instanceof Set?t[n].forEach((function(t){return e.push(t.key)})):e.push(t[n].key)}function J(e,t){for(var n in e){var r=e[n];t(r.key,r.attributes,r.source.key,r.target.key,r.source.attributes,r.target.attributes)}}function q(e,t){for(var n in e)e[n].forEach((function(e){return t(e.key,e.attributes,e.source.key,e.target.key,e.source.attributes,e.target.attributes)}))}function B(e){var t=Object.keys(e),n=t.length,r=null,i=0;return new N((function o(){var a;if(r){var c=r.next();if(c.done)return r=null,i++,o();a=c.value}else{if(i>=n)return{done:!0};var d=t[i];if((a=e[d])instanceof Set)return r=a.values(),o();i++}return{done:!1,value:[a.key,a.attributes,a.source.key,a.target.key,a.source.attributes,a.target.attributes]}}))}function H(e,t,n){n in t&&(t[n]instanceof Set?t[n].forEach((function(t){return e.push(t.key)})):e.push(t[n].key))}function Q(e,t,n){if(t in e)if(e[t]instanceof Set)e[t].forEach((function(e){return n(e.key,e.attributes,e.source.key,e.target.key,e.source.attributes,e.target.attributes)}));else{var r=e[t];n(r.key,r.attributes,r.source.key,r.target.key,r.source.attributes,r.target.attributes)}}function V(e,t){var n=e[t];if(n instanceof Set){var r=n.values();return new N((function(){var e=r.next();if(e.done)return e;var t=e.value;return{done:!1,value:[t.key,t.attributes,t.source.key,t.target.key,t.source.attributes,t.target.attributes]}}))}return N.of([n.key,n.attributes,n.source.key,n.target.key,n.source.attributes,n.target.attributes])}function X(e,t){if(0===e.size)return[];if("mixed"===t||t===e.type)return D(e._edges.keys(),e._edges.size);var n="undirected"===t?e.undirectedSize:e.directedSize,r=new Array(n),i="undirected"===t,o=0;return e._edges.forEach((function(e,t){e instanceof T===i&&(r[o++]=t)})),r}function Z(e,t,n){if(0!==e.size)if("mixed"===t||t===e.type)e._edges.forEach((function(e,t){var r=e.attributes,i=e.source,o=e.target;n(t,r,i.key,o.key,i.attributes,o.attributes)}));else{var r="undirected"===t;e._edges.forEach((function(e,t){if(e instanceof T===r){var i=e.attributes,o=e.source,a=e.target;n(t,i,o.key,a.key,o.attributes,a.attributes)}}))}}function $(e,t){return 0===e.size?N.empty():"mixed"===t?(n=e._edges.values(),new N((function(){var e=n.next();if(e.done)return e;var t=e.value;return{value:[t.key,t.attributes,t.source.key,t.target.key,t.source.attributes,t.target.attributes],done:!1}}))):(n=e._edges.values(),new N((function e(){var r=n.next();if(r.done)return r;var i=r.value;return i instanceof T==("undirected"===t)?{value:[i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes],done:!1}:e()})));var n}function ee(e,t,n){var r=[];return"undirected"!==e&&("out"!==t&&Y(r,n.in),"in"!==t&&Y(r,n.out)),"directed"!==e&&Y(r,n.undirected),r}function te(e,t,n,r,i){var o=e?q:J;"undirected"!==t&&("out"!==n&&o(r.in,i),"in"!==n&&o(r.out,i)),"directed"!==t&&o(r.undirected,i)}function ne(e,t,n){var r=N.empty();return"undirected"!==e&&("out"!==t&&void 0!==n.in&&(r=I(r,B(n.in))),"in"!==t&&void 0!==n.out&&(r=I(r,B(n.out)))),"directed"!==e&&void 0!==n.undirected&&(r=I(r,B(n.undirected))),r}function re(e,t,n,r){var i=[];return"undirected"!==e&&(void 0!==n.in&&"out"!==t&&H(i,n.in,r),void 0!==n.out&&"in"!==t&&H(i,n.out,r)),"directed"!==e&&void 0!==n.undirected&&H(i,n.undirected,r),i}function ie(e,t,n,r,i){"undirected"!==e&&(void 0!==n.in&&"out"!==t&&Q(n.in,r,i),void 0!==n.out&&"in"!==t&&Q(n.out,r,i)),"directed"!==e&&void 0!==n.undirected&&Q(n.undirected,r,i)}function oe(e,t,n,r){var i=N.empty();return"undirected"!==e&&(void 0!==n.in&&"out"!==t&&r in n.in&&(i=I(i,V(n.in,r))),void 0!==n.out&&"in"!==t&&r in n.out&&(i=I(i,V(n.out,r)))),"directed"!==e&&void 0!==n.undirected&&r in n.undirected&&(i=I(i,V(n.undirected,r))),i}var ae=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function ce(e,t){if(void 0!==t)for(var n in t)e.add(n)}function de(e,t,n){if("mixed"!==e){if("undirected"===e)return Object.keys(n.undirected);if("string"==typeof t)return Object.keys(n[t])}var r=new Set;return"undirected"!==e&&("out"!==t&&ce(r,n.in),"in"!==t&&ce(r,n.out)),"directed"!==e&&ce(r,n.undirected),D(r.values(),r.size)}function ue(e,t,n){for(var r in t){var i=t[r];i instanceof Set&&(i=i.values().next().value);var o=i.source,a=i.target,c=o===e?a:o;n(c.key,c.attributes)}}function se(e,t,n,r){for(var i in n){var o=n[i];o instanceof Set&&(o=o.values().next().value);var a=o.source,c=o.target,d=a===t?c:a;e.has(d.key)||(e.add(d.key),r(d.key,d.attributes))}}function he(e,t){var n=Object.keys(t),r=n.length,i=0;return new N((function(){if(i>=r)return{done:!0};var o=t[n[i++]];o instanceof Set&&(o=o.values().next().value);var a=o.source,c=o.target,d=a===e?c:a;return{done:!1,value:[d.key,d.attributes]}}))}function fe(e,t,n){var r=Object.keys(n),i=r.length,o=0;return new N((function a(){if(o>=i)return{done:!0};var c=n[r[o++]];c instanceof Set&&(c=c.values().next().value);var d=c.source,u=c.target,s=d===t?u:d;return e.has(s.key)?a():(e.add(s.key),{done:!1,value:[s.key,s.attributes]})}))}function pe(e,t,n,r,i){var o=e._nodes.get(r);if("undirected"!==t){if("out"!==n&&void 0!==o.in)for(var a in o.in)if(a===i)return!0;if("in"!==n&&void 0!==o.out)for(var c in o.out)if(c===i)return!0}if("directed"!==t&&void 0!==o.undirected)for(var d in o.undirected)if(d===i)return!0;return!1}function ge(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);e.prototype[o]=function(e,t){if("mixed"===r||"mixed"===this.type||r===this.type){e=""+e;var n=this._nodes.get(e);if(void 0===n)throw new U("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));!function(e,t,n,r){if("mixed"!==e){if("undirected"===e)return ue(n,n.undirected,r);if("string"==typeof t)return ue(n,n[t],r)}var i=new Set;"undirected"!==e&&("out"!==t&&se(i,n,n.in,r),"in"!==t&&se(i,n,n.out,r)),"directed"!==e&&se(i,n,n.undirected,r)}("mixed"===r?this.type:r,i,n,t)}}}function le(e,t){var n=t.name,r=t.type,i=t.direction,o=n.slice(0,-1)+"Entries";e.prototype[o]=function(e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return N.empty();e=""+e;var t=this._nodes.get(e);if(void 0===t)throw new U("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return function(e,t,n){if("mixed"!==e){if("undirected"===e)return he(n,n.undirected);if("string"==typeof t)return he(n,n[t])}var r=N.empty(),i=new Set;return"undirected"!==e&&("out"!==t&&(r=I(r,fe(i,n,n.in))),"in"!==t&&(r=I(r,fe(i,n,n.out)))),"directed"!==e&&(r=I(r,fe(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,t)}}function ye(e,t){var n={key:e};return Object.keys(t.attributes).length&&(n.attributes=d({},t.attributes)),n}function ve(e,t){var n={source:t.source.key,target:t.target.key};return t.generatedKey||(n.key=e),Object.keys(t.attributes).length&&(n.attributes=d({},t.attributes)),t instanceof T&&(n.undirected=!0),n}function we(e){return h(e)?"key"in e?!("attributes"in e)||h(e.attributes)&&null!==e.attributes?null:"invalid-attributes":"no-key":"not-object"}function be(e){return h(e)?"source"in e?"target"in e?!("attributes"in e)||h(e.attributes)&&null!==e.attributes?"undirected"in e&&"boolean"!=typeof e.undirected?"invalid-undirected":null:"invalid-attributes":"no-target":"no-source":"not-object"}var me=new Set(["directed","undirected","mixed"]),_e=new Set(["domain","_events","_eventsCount","_maxListeners"]),Ge={allowSelfLoops:!0,edgeKeyGenerator:null,multi:!1,type:"mixed"};function Ee(e,t,n,r,i,o,a,c){if(!r&&"undirected"===e.type)throw new z("Graph.".concat(t,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===e.type)throw new z("Graph.".concat(t,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(c&&!h(c))throw new j("Graph.".concat(t,': invalid attributes. Expecting an object but got "').concat(c,'"'));if(o=""+o,a=""+a,c=c||{},!e.allowSelfLoops&&o===a)throw new z("Graph.".concat(t,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var d=e._nodes.get(o),u=e._nodes.get(a);if(!d)throw new U("Graph.".concat(t,': source node "').concat(o,'" not found.'));if(!u)throw new U("Graph.".concat(t,': target node "').concat(a,'" not found.'));var s={key:null,undirected:r,source:o,target:a,attributes:c};if(n&&(i=e._edgeKeyGenerator(s)),i=""+i,e._edges.has(i))throw new z("Graph.".concat(t,': the "').concat(i,'" edge already exists in the graph.'));if(!e.multi&&(r?void 0!==d.undirected[a]:void 0!==d.out[a]))throw new z("Graph.".concat(t,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var f=new(r?T:C)(i,n,d,u,c);return e._edges.set(i,f),o===a?r?d.undirectedSelfLoops++:d.directedSelfLoops++:r?(d.undirectedDegree++,u.undirectedDegree++):(d.outDegree++,u.inDegree++),P(e,r,f,o,a,d,u),r?e._undirectedSize++:e._directedSize++,s.key=i,e.emit("edgeAdded",s),i}function ke(e,t,n,r,i,o,a,c){if(!r&&"undirected"===e.type)throw new z("Graph.".concat(t,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===e.type)throw new z("Graph.".concat(t,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(c&&!h(c))throw new j("Graph.".concat(t,': invalid attributes. Expecting an object but got "').concat(c,'"'));if(o=""+o,a=""+a,c=c||{},!e.allowSelfLoops&&o===a)throw new z("Graph.".concat(t,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var s,f,p=e._nodes.get(o),g=e._nodes.get(a),l=null;if(!n&&(s=e._edges.get(i))){if(s.source!==o||s.target!==a||r&&(s.source!==a||s.target!==o))throw new z("Graph.".concat(t,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. (').concat(s.source,", ").concat(s.target,")."));l=i}if(l||e.multi||!p||(r?void 0===p.undirected[a]:void 0===p.out[a])||(f=u(e,o,a,r?"undirected":"directed")),f)return c?(d(f.attributes,c),l):l;var y={key:null,undirected:r,source:o,target:a,attributes:c};if(n&&(i=e._edgeKeyGenerator(y)),i=""+i,e._edges.has(i))throw new z("Graph.".concat(t,': the "').concat(i,'" edge already exists in the graph.'));return p||(e.addNode(o),p=e._nodes.get(o),o===a&&(g=p)),g||(e.addNode(a),g=e._nodes.get(a)),s=new(r?T:C)(i,n,p,g,c),e._edges.set(i,s),o===a?r?p.undirectedSelfLoops++:p.directedSelfLoops++:r?(p.undirectedDegree++,g.undirectedDegree++):(p.outDegree++,g.inDegree++),P(e,r,s,o,a,p,g),r?e._undirectedSize++:e._directedSize++,y.key=i,e.emit("edgeAdded",y),i}var xe=function(e){function n(t){var n;if(n=e.call(this)||this,(t=d({},Ge,t)).edgeKeyGenerator&&"function"!=typeof t.edgeKeyGenerator)throw new j("Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got \"".concat(t.edgeKeyGenerator,'".'));if("boolean"!=typeof t.multi)throw new j("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!me.has(t.type))throw new j('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new j("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r,i="mixed"===t.type?O:"directed"===t.type?K:M;return p(c(n),"NodeDataClass",i),p(c(n),"_attributes",{}),p(c(n),"_nodes",new Map),p(c(n),"_edges",new Map),p(c(n),"_directedSize",0),p(c(n),"_undirectedSize",0),p(c(n),"_edgeKeyGenerator",t.edgeKeyGenerator||(r=0,function(){return"_geid".concat(r++,"_")})),p(c(n),"_options",t),_e.forEach((function(e){return p(c(n),e,n[e])})),g(c(n),"order",(function(){return n._nodes.size})),g(c(n),"size",(function(){return n._edges.size})),g(c(n),"directedSize",(function(){return n._directedSize})),g(c(n),"undirectedSize",(function(){return n._undirectedSize})),g(c(n),"multi",n._options.multi),g(c(n),"type",n._options.type),g(c(n),"allowSelfLoops",n._options.allowSelfLoops),n}t(n,e);var r=n.prototype;return r.hasNode=function(e){return this._nodes.has(""+e)},r.hasDirectedEdge=function(e,t){if("undirected"===this.type)return!1;if(1===arguments.length){var n=""+e,r=this._edges.get(n);return!!r&&r instanceof C}if(2===arguments.length){e=""+e,t=""+t;var i=this._nodes.get(e);if(!i)return!1;var o=i.out[t];return!!o&&(!this.multi||!!o.size)}throw new j("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.hasUndirectedEdge=function(e,t){if("directed"===this.type)return!1;if(1===arguments.length){var n=""+e,r=this._edges.get(n);return!!r&&r instanceof T}if(2===arguments.length){e=""+e,t=""+t;var i=this._nodes.get(e);if(!i)return!1;var o=i.undirected[t];return!!o&&(!this.multi||!!o.size)}throw new j("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.hasEdge=function(e,t){if(1===arguments.length){var n=""+e;return this._edges.has(n)}if(2===arguments.length){e=""+e,t=""+t;var r=this._nodes.get(e);if(!r)return!1;var i=void 0!==r.out&&r.out[t];return i||(i=void 0!==r.undirected&&r.undirected[t]),!!i&&(!this.multi||!!i.size)}throw new j("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.directedEdge=function(e,t){if("undirected"!==this.type){if(e=""+e,t=""+t,this.multi)throw new z("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(e);if(!n)throw new U('Graph.directedEdge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U('Graph.directedEdge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.out&&n.out[t]||void 0;return r?r.key:void 0}},r.undirectedEdge=function(e,t){if("directed"!==this.type){if(e=""+e,t=""+t,this.multi)throw new z("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(e);if(!n)throw new U('Graph.undirectedEdge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U('Graph.undirectedEdge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.undirected&&n.undirected[t]||void 0;return r?r.key:void 0}},r.edge=function(e,t){if(this.multi)throw new z("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");e=""+e,t=""+t;var n=this._nodes.get(e);if(!n)throw new U('Graph.edge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U('Graph.edge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.out&&n.out[t]||n.undirected&&n.undirected[t]||void 0;if(r)return r.key},r.inDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new j('Graph.inDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.inDegree: could not find the "'.concat(e,'" node in the graph.'));if("undirected"===this.type)return 0;var r=t?n.directedSelfLoops:0;return n.inDegree+r},r.outDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new j('Graph.outDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.outDegree: could not find the "'.concat(e,'" node in the graph.'));if("undirected"===this.type)return 0;var r=t?n.directedSelfLoops:0;return n.outDegree+r},r.directedDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new j('Graph.directedDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));if(e=""+e,!this.hasNode(e))throw new U('Graph.directedDegree: could not find the "'.concat(e,'" node in the graph.'));return"undirected"===this.type?0:this.inDegree(e,t)+this.outDegree(e,t)},r.undirectedDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new j('Graph.undirectedDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));if(e=""+e,!this.hasNode(e))throw new U('Graph.undirectedDegree: could not find the "'.concat(e,'" node in the graph.'));if("directed"===this.type)return 0;var n=this._nodes.get(e),r=t?2*n.undirectedSelfLoops:0;return n.undirectedDegree+r},r.degree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new j('Graph.degree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));if(e=""+e,!this.hasNode(e))throw new U('Graph.degree: could not find the "'.concat(e,'" node in the graph.'));var n=0;return"undirected"!==this.type&&(n+=this.directedDegree(e,t)),"directed"!==this.type&&(n+=this.undirectedDegree(e,t)),n},r.source=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.source: could not find the "'.concat(e,'" edge in the graph.'));return t.source.key},r.target=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.target: could not find the "'.concat(e,'" edge in the graph.'));return t.target.key},r.extremities=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.extremities: could not find the "'.concat(e,'" edge in the graph.'));return[t.source.key,t.target.key]},r.opposite=function(e,t){if(e=""+e,t=""+t,!this._nodes.has(e))throw new U('Graph.opposite: could not find the "'.concat(e,'" node in the graph.'));var n=this._edges.get(t);if(!n)throw new U('Graph.opposite: could not find the "'.concat(t,'" edge in the graph.'));var r=n.source,i=n.target,o=r.key,a=i.key;if(e!==o&&e!==a)throw new U('Graph.opposite: the "'.concat(e,'" node is not attached to the "').concat(t,'" edge (').concat(o,", ").concat(a,")."));return e===o?a:o},r.undirected=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.undirected: could not find the "'.concat(e,'" edge in the graph.'));return t instanceof T},r.directed=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.directed: could not find the "'.concat(e,'" edge in the graph.'));return t instanceof C},r.selfLoop=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.selfLoop: could not find the "'.concat(e,'" edge in the graph.'));return t.source===t.target},r.addNode=function(e,t){if(t&&!h(t))throw new j('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(t,'"'));if(e=""+e,t=t||{},this._nodes.has(e))throw new z('Graph.addNode: the "'.concat(e,'" node already exist in the graph.'));var n=new this.NodeDataClass(e,t);return this._nodes.set(e,n),this.emit("nodeAdded",{key:e,attributes:t}),e},r.mergeNode=function(e,t){if(t&&!h(t))throw new j('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(t,'"'));e=""+e,t=t||{};var n=this._nodes.get(e);return n?(t&&d(n.attributes,t),e):(n=new this.NodeDataClass(e,t),this._nodes.set(e,n),this.emit("nodeAdded",{key:e,attributes:t}),e)},r.dropNode=function(e){if(e=""+e,!this.hasNode(e))throw new U('Graph.dropNode: could not find the "'.concat(e,'" node in the graph.'));for(var t=this.edges(e),n=0,r=t.length;n<r;n++)this.dropEdge(t[n]);var i=this._nodes.get(e);this._nodes.delete(e),this.emit("nodeDropped",{key:e,attributes:i.attributes})},r.dropEdge=function(e){var t;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(t=u(this,n,r,this.type)))throw new U('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(e=""+e,!(t=this._edges.get(e)))throw new U('Graph.dropEdge: could not find the "'.concat(e,'" edge in the graph.'));this._edges.delete(t.key);var i=t,o=i.source,a=i.target,c=i.attributes,d=t instanceof T;return o===a?o.selfLoops--:d?(o.undirectedDegree--,a.undirectedDegree--):(o.outDegree--,a.inDegree--),W(this,d,t),d?this._undirectedSize--:this._directedSize--,this.emit("edgeDropped",{key:e,attributes:c,source:o.key,target:a.key,undirected:d}),this},r.clear=function(){this._edges.clear(),this._nodes.clear(),this.emit("cleared")},r.clearEdges=function(){this._edges.clear(),this.clearIndex(),this.emit("edgesCleared")},r.getAttribute=function(e){return this._attributes[e]},r.getAttributes=function(){return this._attributes},r.hasAttribute=function(e){return this._attributes.hasOwnProperty(e)},r.setAttribute=function(e,t){return this._attributes[e]=t,this.emit("attributesUpdated",{type:"set",meta:{name:e,value:t}}),this},r.updateAttribute=function(e,t){if("function"!=typeof t)throw new j("Graph.updateAttribute: updater should be a function.");return this._attributes[e]=t(this._attributes[e]),this.emit("attributesUpdated",{type:"set",meta:{name:e,value:this._attributes[e]}}),this},r.removeAttribute=function(e){return delete this._attributes[e],this.emit("attributesUpdated",{type:"remove",meta:{name:e}}),this},r.replaceAttributes=function(e){if(!h(e))throw new j("Graph.replaceAttributes: provided attributes are not a plain object.");var t=this._attributes;return this._attributes=e,this.emit("attributesUpdated",{type:"replace",meta:{before:t,after:e}}),this},r.mergeAttributes=function(e){if(!h(e))throw new j("Graph.mergeAttributes: provided attributes are not a plain object.");return this._attributes=d(this._attributes,e),this.emit("attributesUpdated",{type:"merge",meta:{data:this._attributes}}),this},r.getNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.getNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return n.attributes[t]},r.getNodeAttributes=function(e){e=""+e;var t=this._nodes.get(e);if(!t)throw new U('Graph.getNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));return t.attributes},r.hasNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.hasNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return n.attributes.hasOwnProperty(t)},r.setNodeAttribute=function(e,t,n){e=""+e;var r=this._nodes.get(e);if(!r)throw new U('Graph.setNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));if(arguments.length<3)throw new j("Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.");return r.attributes[t]=n,this.emit("nodeAttributesUpdated",{key:e,type:"set",meta:{name:t,value:n}}),this},r.updateNodeAttribute=function(e,t,n){e=""+e;var r=this._nodes.get(e);if(!r)throw new U('Graph.updateNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));if(arguments.length<3)throw new j("Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.");if("function"!=typeof n)throw new j("Graph.updateAttribute: updater should be a function.");var i=r.attributes;return i[t]=n(i[t]),this.emit("nodeAttributesUpdated",{key:e,type:"set",meta:{name:t,value:i[t]}}),this},r.removeNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.hasNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return delete n.attributes[t],this.emit("nodeAttributesUpdated",{key:e,type:"remove",meta:{name:t}}),this},r.replaceNodeAttributes=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.replaceNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));if(!h(t))throw new j("Graph.replaceNodeAttributes: provided attributes are not a plain object.");var r=n.attributes;return n.attributes=t,this.emit("nodeAttributesUpdated",{key:e,type:"replace",meta:{before:r,after:t}}),this},r.mergeNodeAttributes=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new U('Graph.mergeNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));if(!h(t))throw new j("Graph.mergeNodeAttributes: provided attributes are not a plain object.");return d(n.attributes,t),this.emit("nodeAttributesUpdated",{key:e,type:"merge",meta:{data:t}}),this},r.forEach=function(e){if("function"!=typeof e)throw new j("Graph.forEach: expecting a callback.");this._edges.forEach((function(t,n){var r=t.source,i=t.target;e(r.key,i.key,r.attributes,i.attributes,n,t.attributes)}))},r.adjacency=function(){var e=this._edges.values();return new N((function(){var t=e.next();if(t.done)return t;var n=t.value,r=n.source,i=n.target;return{done:!1,value:[r.key,i.key,r.attributes,i.attributes,n.key,n.attributes]}}))},r.nodes=function(){return D(this._nodes.keys(),this._nodes.size)},r.forEachNode=function(e){if("function"!=typeof e)throw new j("Graph.forEachNode: expecting a callback.");this._nodes.forEach((function(t,n){e(n,t.attributes)}))},r.nodeEntries=function(){var e=this._nodes.values();return new N((function(){var t=e.next();if(t.done)return t;var n=t.value;return{value:[n.key,n.attributes],done:!1}}))},r.exportNode=function(e){e=""+e;var t=this._nodes.get(e);if(!t)throw new U('Graph.exportNode: could not find the "'.concat(e,'" node in the graph.'));return ye(e,t)},r.exportEdge=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new U('Graph.exportEdge: could not find the "'.concat(e,'" edge in the graph.'));return ve(e,t)},r.export=function(){var e=new Array(this._nodes.size),t=0;this._nodes.forEach((function(n,r){e[t++]=ye(r,n)}));var n=new Array(this._edges.size);return t=0,this._edges.forEach((function(e,r){n[t++]=ve(r,e)})),{attributes:this.getAttributes(),nodes:e,edges:n}},r.importNode=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=we(e);if(n){if("not-object"===n)throw new j('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if("no-key"===n)throw new j("Graph.importNode: no key provided.");if("invalid-attributes"===n)throw new j("Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.")}var r=e.key,i=e.attributes,o=void 0===i?{}:i;return t?this.mergeNode(r,o):this.addNode(r,o),this},r.importEdge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=be(e);if(n){if("not-object"===n)throw new j('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if("no-source"===n)throw new j("Graph.importEdge: missing souce.");if("no-target"===n)throw new j("Graph.importEdge: missing target.");if("invalid-attributes"===n)throw new j("Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.");if("invalid-undirected"===n)throw new j("Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.")}var r=e.source,i=e.target,o=e.attributes,a=void 0===o?{}:o,c=e.undirected,d=void 0!==c&&c;return"key"in e?(t?d?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:d?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,e.key,r,i,a):(t?d?this.mergeUndirectedEdge:this.mergeDirectedEdge:d?this.addUndirectedEdge:this.addDirectedEdge).call(this,r,i,a),this},r.import=function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(s(e))return this.import(e.export(),n),this;if(!h(e))throw new j("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(e.attributes){if(!h(e.attributes))throw new j("Graph.import: invalid attributes. Expecting a plain object.");n?this.mergeAttributes(e.attributes):this.replaceAttributes(e.attributes)}return e.nodes&&e.nodes.forEach((function(e){return t.importNode(e,n)})),e.edges&&e.edges.forEach((function(e){return t.importEdge(e,n)})),this},r.nullCopy=function(e){return new n(d({},this._options,e))},r.emptyCopy=function(e){var t=new n(d({},this._options,e));return this._nodes.forEach((function(e,n){e=new t.NodeDataClass(n,d({},e.attributes)),t._nodes.set(n,e)})),t},r.copy=function(){var e=new n(this._options);return e.import(this),e},r.upgradeToMixed=function(){return"mixed"===this.type||(this._nodes.forEach((function(e){return e.upgradeToMixed()})),this._options.type="mixed",g(this,"type",this._options.type),p(this,"NodeDataClass",O)),this},r.upgradeToMulti=function(){return this.multi||(this._options.multi=!0,g(this,"multi",!0),(e=this)._nodes.forEach((function(t,n){if(t.out)for(var r in t.out){var i=new Set;i.add(t.out[r]),t.out[r]=i,e._nodes.get(r).in[n]=i}if(t.undirected)for(var o in t.undirected)if(!(o>n)){var a=new Set;a.add(t.undirected[o]),t.undirected[o]=a,e._nodes.get(o).undirected[n]=a}}))),this;var e},r.clearIndex=function(){return this._nodes.forEach((function(e){void 0!==e.in&&(e.in={},e.out={}),void 0!==e.undirected&&(e.undirected={})})),this},r.toJSON=function(){return this.export()},r.toString=function(){var e=this.order>1||0===this.order,t=this.size>1||0===this.size;return"Graph<".concat(f(this.order)," node").concat(e?"s":"",", ").concat(f(this.size)," edge").concat(t?"s":"",">")},r.inspect=function(){var e=this,t={};this._nodes.forEach((function(e,n){t[n]=e.attributes}));var n={},r={};this._edges.forEach((function(t,i){var o=t instanceof T?"--":"->",a="",c="(".concat(t.source.key,")").concat(o,"(").concat(t.target.key,")");t.generatedKey?e.multi&&(void 0===r[c]?r[c]=0:r[c]++,a+="".concat(r[c],". ")):a+="[".concat(i,"]: "),n[a+=c]=t.attributes}));var i={};for(var o in this)this.hasOwnProperty(o)&&!_e.has(o)&&"function"!=typeof this[o]&&(i[o]=this[o]);return i.attributes=this._attributes,i.nodes=t,i.edges=n,p(i,"constructor",this.constructor),i},n}(y);"undefined"!=typeof Symbol&&(xe.prototype[Symbol.for("nodejs.util.inspect.custom")]=xe.prototype.inspect),[{name:function(e){return"".concat(e,"Edge")},generateKey:!0},{name:function(e){return"".concat(e,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(e){return"".concat(e,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(e){return"".concat(e,"EdgeWithKey")}},{name:function(e){return"".concat(e,"DirectedEdgeWithKey")},type:"directed"},{name:function(e){return"".concat(e,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(e){["add","merge"].forEach((function(t){var n=e.name(t),r="add"===t?Ee:ke;e.generateKey?xe.prototype[n]=function(t,i,o){return r(this,n,!0,"undirected"===(e.type||this.type),null,t,i,o)}:xe.prototype[n]=function(t,i,o,a){return r(this,n,!1,"undirected"===(e.type||this.type),t,i,o,a)}}))})),"undefined"!=typeof Symbol&&(xe.prototype[Symbol.iterator]=xe.prototype.adjacency),function(e){R.forEach((function(t){var n=t.name,r=t.attacher;r(e,n("Edge"),"mixed",C),r(e,n("DirectedEdge"),"directed",C),r(e,n("UndirectedEdge"),"undirected",T)}))}(xe),function(e){F.forEach((function(t){!function(e,t){var n=t.name,r=t.type,i=t.direction;e.prototype[n]=function(e,t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(!arguments.length)return X(this,r);if(1===arguments.length){e=""+e;var o=this._nodes.get(e);if(void 0===o)throw new U("Graph.".concat(n,': could not find the "').concat(e,'" node in the graph.'));return ee("mixed"===r?this.type:r,i,o)}if(2===arguments.length){e=""+e,t=""+t;var a=this._nodes.get(e);if(!a)throw new U("Graph.".concat(n,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U("Graph.".concat(n,':  could not find the "').concat(t,'" target node in the graph.'));return re(r,i,a,t)}throw new j("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(e,t),function(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);e.prototype[o]=function(e,t,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return Z(this,r,n=e);if(2===arguments.length){e=""+e,n=t;var a=this._nodes.get(e);if(void 0===a)throw new U("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return te(this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){e=""+e,t=""+t;var c=this._nodes.get(e);if(!c)throw new U("Graph.".concat(o,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U("Graph.".concat(o,':  could not find the "').concat(t,'" target node in the graph.'));return ie(r,i,c,t,n)}throw new j("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}}}(e,t),function(e,t){var n=t.name,r=t.type,i=t.direction,o=n.slice(0,-1)+"Entries";e.prototype[o]=function(e,t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return N.empty();if(!arguments.length)return $(this,r);if(1===arguments.length){e=""+e;var n=this._nodes.get(e);if(!n)throw new U("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return ne(r,i,n)}if(2===arguments.length){e=""+e,t=""+t;var a=this._nodes.get(e);if(!a)throw new U("Graph.".concat(o,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new U("Graph.".concat(o,':  could not find the "').concat(t,'" target node in the graph.'));return oe(r,i,a,t)}throw new j("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(e,t)}))}(xe),function(e){ae.forEach((function(t){!function(e,t){var n=t.name,r=t.type,i=t.direction;e.prototype[n]=function(e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(2===arguments.length){var t=""+arguments[0],o=""+arguments[1];if(!this._nodes.has(t))throw new U("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));if(!this._nodes.has(o))throw new U("Graph.".concat(n,': could not find the "').concat(o,'" node in the graph.'));return pe(this,r,i,t,o)}if(1===arguments.length){e=""+e;var a=this._nodes.get(e);if(void 0===a)throw new U("Graph.".concat(n,': could not find the "').concat(e,'" node in the graph.'));var c=de("mixed"===r?this.type:r,i,a);return c}throw new j("Graph.".concat(n,": invalid number of arguments (expecting 1 or 2 and got ").concat(arguments.length,")."))}}(e,t),ge(e,t),le(e,t)}))}(xe);var Se=function(e){function n(t){return e.call(this,d({type:"directed"},t))||this}return t(n,e),n}(xe),Ae=function(e){function n(t){return e.call(this,d({type:"undirected"},t))||this}return t(n,e),n}(xe),Ne=function(e){function n(t){return e.call(this,d({multi:!0},t))||this}return t(n,e),n}(xe),De=function(e){function n(t){return e.call(this,d({multi:!0,type:"directed"},t))||this}return t(n,e),n}(xe),Le=function(e){function n(t){return e.call(this,d({multi:!0,type:"undirected"},t))||this}return t(n,e),n}(xe);function je(e){e.from=function(t,n){var r=new e(n);return r.import(t),r}}return je(xe),je(Se),je(Ae),je(Ne),je(De),je(Le),xe.Graph=xe,xe.DirectedGraph=Se,xe.UndirectedGraph=Ae,xe.MultiGraph=Ne,xe.MultiDirectedGraph=De,xe.MultiUndirectedGraph=Le,xe.InvalidArgumentsGraphError=j,xe.NotFoundGraphError=U,xe.UsageGraphError=z,xe}));
//# sourceMappingURL=graphology.umd.min.js.map


/***/ }),

/***/ "./src/components/workers/embeddings/worker_forceatlas2.ts":
/*!*****************************************************************!*\
  !*** ./src/components/workers/embeddings/worker_forceatlas2.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Graph = __webpack_require__(/*! graphology */ "./node_modules/graphology/dist/graphology.umd.min.js");
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


var NODE_X = 0,
    NODE_Y = 1,
    NODE_DX = 2,
    NODE_DY = 3,
    NODE_OLD_DX = 4,
    NODE_OLD_DY = 5,
    NODE_MASS = 6,
    NODE_CONVERGENCE = 7,
    NODE_SIZE = 8,
    NODE_FIXED = 9;
var EDGE_SOURCE = 0,
    EDGE_TARGET = 1,
    EDGE_WEIGHT = 2;
var REGION_NODE = 0,
    REGION_CENTER_X = 1,
    REGION_CENTER_Y = 2,
    REGION_SIZE = 3,
    REGION_NEXT_SIBLING = 4,
    REGION_FIRST_CHILD = 5,
    REGION_MASS = 6,
    REGION_MASS_CENTER_X = 7,
    REGION_MASS_CENTER_Y = 8;
var SUBDIVISION_ATTEMPTS = 3;
/**
 * Constants.
 */

var PPN = 10,
    PPE = 3,
    PPR = 9;
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
  var l, r, n, n1, n2, rn, e, w, g, s;
  var order = NodeMatrix.length,
      size = EdgeMatrix.length;
  var adjustSizes = options.adjustSizes;
  var thetaSquared = options.barnesHutTheta * options.barnesHutTheta;
  var outboundAttCompensation, coefficient, xDist, yDist, ewc, distance, factor;
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
    var minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        q,
        q2,
        subdivisionAttempts; // Computing min and max values

    for (n = 0; n < order; n += PPN) {
      minX = Math.min(minX, NodeMatrix[n + NODE_X]);
      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
    } // squarify bounds, it's a quadtree


    var dx = maxX - minX,
        dy = maxY - minY;

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
          } else {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            } else {
              // Bottom Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            }
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
            } else {
              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
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
            } else {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
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
              //-- Linear Anti-collision Repulsion
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
              //-- Linear Repulsion
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
              //-- Linear Anti-collision Repulsion
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
              //-- Linear Repulsion
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
          //-- Anticollision Linear Repulsion
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
          //-- Linear Repulsion
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
      //-- Strong gravity
      if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
    } else {
      //-- Linear Anti-collision Repulsion n
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
          //-- LinLog Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance;
          }
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- Linear Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc;
          }
        }
      }
    } else {
      distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          //-- LinLog Degree Distributed Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Attraction
          if (distance > 0) factor = -coefficient * ewc * Math.log(1 + distance) / distance;
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Attraction Mass Distributed
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
        } else {
          //-- Linear Attraction
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc;
        }
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


  var force, swinging, traction, nodespeed, newX, newY; // MATH: sqrt and square distances

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

;
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

;
/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {object}       - Both matrices.
 */

function graphToByteArrays(graph) {
  var nodes = graph.nodes(),
      edges = graph.edges(),
      order = nodes.length,
      size = edges.length,
      index = {},
      i,
      j;
  var NodeMatrix = new Float32Array(order * PPN),
      EdgeMatrix = new Float32Array(size * PPE); // Iterate through nodes

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

;
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

;
/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}        graph      - Target graph.
 * @param  {Float32Array} NodeMatrix - Node matrix.
 * @return {object}                  - Map to node positions.
 */

function collectLayoutChanges(graph, NodeMatrix) {
  var nodes = graph.nodes(),
      positions = Object.create(null);

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    positions[nodes[j]] = {
      x: NodeMatrix[i],
      y: NodeMatrix[i + 1]
    };
    j++;
  }

  return positions;
}

;

function assignH(target) {
  for (var _len = arguments.length, other = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    other[_key - 1] = arguments[_key];
  }

  target = target || {};
  var objects = Array.prototype.slice.call(arguments).slice(1),
      i,
      k,
      l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i]) continue;

    for (k in objects[i]) {
      target[k] = objects[i][k];
    }
  }

  return target;
}

;
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

function abstractSynchronousLayout(graph, params) {
  var assign = null;
  if (typeof params === 'number') params = {
    iterations: params
  };
  var iterations = params.iterations; // Validating settings

  var settings = assignH({}, DEFAULT_SETTINGS, params.settings),
      validationError = validateSettings(settings);
  if (validationError) throw new Error('graphology-layout-forceatlas2: ' + validationError.message); // Building matrices

  var matrices = graphToByteArrays(graph),
      i; // Iterating

  for (i = 0; i < iterations; i++) {
    iterate(settings, matrices.nodes, matrices.edges);
  } // Applying


  if (assign) {
    assignLayoutChanges(graph, matrices.nodes);
    return;
  }

  return collectLayoutChanges(graph, matrices.nodes);
}

self.addEventListener('message', function (e) {
  var postMessage = self.postMessage;
  var nodes = e.data.nodes;
  var edges = e.data.edges;
  var params = e.data.params;
  var graph = new Graph();
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

  var settings = assignH({}, DEFAULT_SETTINGS, params.settings),
      validationError = validateSettings(settings);
  if (validationError) throw new Error('graphology-layout-forceatlas2: ' + validationError.message); // Building matrices

  var matrices = graphToByteArrays(graph),
      i; // Iterating

  for (i = 0; i < iterations; i++) {
    if (i % Math.floor(iterations / 100) == 0) {
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

/******/ });
//# sourceMappingURL=forceatlas2.js.map