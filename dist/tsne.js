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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/components/workers/embeddings/worker_tsne.ts");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/components/workers/embeddings/worker_tsne.ts":
/*!**********************************************************!*\
  !*** ./src/components/workers/embeddings/worker_tsne.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js"); // create main global object


var tsnejs = tsnejs || {
  REVISION: 'ALPHA'
};

(function (global) {
  "use strict"; // utility function

  var assert = function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }; // syntax sugar


  var getopt = function getopt(opt, field, defaultval) {
    if (opt.hasOwnProperty(field)) {
      return opt[field];
    } else {
      return defaultval;
    }
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
    } else {
      return new Float64Array(n); // typed arrays are faster
    }
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


  var xtod = function xtod(X) {
    var N = X.length;
    var dist = zeros(N * N); // allocate contiguous array

    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var d = L2(X[i], X[j]);
        dist[i * N + j] = d;
        dist[j * N + i] = d;
      }
    }

    return dist;
  }; // compute (p_{i|j} + p_{j|i})/(2n)


  var d2p = function d2p(D, perplexity, tol) {
    var Nf = Math.sqrt(D.length); // this better be an integer

    var N = Math.floor(Nf);
    assert(N === Nf, "D should have square number of elements.");
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
        //debugger;
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
            beta = beta * 2;
          } else {
            beta = (beta + betamax) / 2;
          }
        } else {
          // converse case. make distrubtion less peaky
          betamax = beta;

          if (betamin === -Infinity) {
            beta = beta / 2;
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
    this.perplexity = getopt(opt, "perplexity", 30); // effective number of nearest neighbors

    this.dim = getopt(opt, "dim", 2); // by default 2-D tSNE

    this.epsilon = getopt(opt, "epsilon", 10); // learning rate

    this.iter = 0;
  };

  tSNE.prototype = {
    // this function takes a set of high-dimensional points
    // and creates matrix P from them using gaussian kernel
    initDataRaw: function initDataRaw(X) {
      var N = X.length;
      var D = X[0].length;
      assert(N > 0, " X is empty? You must have some data!");
      assert(D > 0, " X[0] is empty? Where is the data?");
      var dists = xtod(X); // convert X to distances using gaussian kernel

      this.P = d2p(dists, this.perplexity, 1e-4); // attach to object

      this.N = N; // back up the size of the dataset

      this.initSolution(); // refresh this
    },
    initDataSeeded: function initDataSeeded(X, seed) {
      var N = X.length;
      var D = X[0].length;
      assert(N > 0, " X is empty? You must have some data!");
      assert(D > 0, " X[0] is empty? Where is the data?");
      var dists = xtod(X); // convert X to distances using gaussian kernel

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
      assert(N > 0, " X is empty? You must have some data!"); // convert D to a (fast) typed array version

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
      } //if(this.iter%100===0) console.log('iter ' + this.iter + ', cost: ' + cost);


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
      dim: 2
    });
    context.tsne.initDataSeeded(e.data.input, e.data.params.seeded ? e.data.seed : undefined);
    context.tsne.step();
    context.postMessage(context.tsne.getSolution());
    console.log(context.tsne.getSolution());
  } else if (context.tsne != null) {
    context.tsne.step();
    context.postMessage(context.tsne.getSolution());
  }
}, false);

/***/ })

/******/ });
//# sourceMappingURL=tsne.js.map