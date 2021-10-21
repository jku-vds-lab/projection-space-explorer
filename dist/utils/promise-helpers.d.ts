export declare function makeCancelable(promise: any): {
    promise: Promise<unknown>;
    cancel(): void;
};
export declare function useCancellablePromise(cancelable?: typeof makeCancelable): {
    cancellablePromise: <T = any>(p: Promise<T>, controller?: AbortController) => Promise<T>;
    cancelPromises: () => void;
};
