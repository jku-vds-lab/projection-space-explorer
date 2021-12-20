"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://rajeshnaroth.medium.com/writing-a-react-hook-to-cancel-promises-when-a-component-unmounts-526efabf251f
const react_1 = require("react");
function makeCancelable(promise) {
    let isCanceled = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise
            .then(val => (isCanceled ? reject(new Error("Promise is canceled: " + isCanceled)) : resolve(val)))
            .catch(error => (isCanceled ? reject(new Error("Promise is canceled: " + isCanceled)) : reject(error)));
    });
    return {
        promise: wrappedPromise,
        cancel() {
            isCanceled = true;
        },
    };
}
exports.makeCancelable = makeCancelable;
function useCancellablePromise(cancelable = makeCancelable) {
    const emptyPromise = Promise.resolve(true);
    // test if the input argument is a cancelable promise generator
    if (cancelable(emptyPromise).cancel === undefined) {
        throw new Error('promise wrapper argument must provide a cancel() function');
    }
    const promises = react_1.useRef();
    const controllers = react_1.useRef();
    react_1.useEffect(() => {
        // @ts-ignore
        promises.current = promises.current || [];
        // @ts-ignore
        controllers.current = controllers.current || [];
        return function cancel() {
            // @ts-ignore
            controllers.current.forEach(p => p.abort());
            // @ts-ignore
            controllers.current = [];
            // @ts-ignore
            promises.current.forEach(p => p.cancel());
            // @ts-ignore
            promises.current = [];
        };
    }, []);
    function cancellablePromise(p, controller) {
        const cPromise = cancelable(p);
        // @ts-ignore
        promises.current.push(cPromise);
        if (controller)
            // @ts-ignore
            controllers.current.push(controller);
        // @ts-ignore
        return cPromise.promise;
    }
    function cancelPromises() {
        var _a, _b;
        // @ts-ignore
        (_a = controllers.current) === null || _a === void 0 ? void 0 : _a.forEach(p => p.abort());
        // @ts-ignore
        controllers.current = [];
        // @ts-ignore
        (_b = promises.current) === null || _b === void 0 ? void 0 : _b.forEach(p => p.cancel());
        // @ts-ignore
        promises.current = [];
    }
    return { cancellablePromise, cancelPromises };
}
exports.useCancellablePromise = useCancellablePromise;
