export declare function makeCancelable(promise: any): {
    promise: Promise<unknown>;
    cancel(): void;
};
export declare function useCancellablePromise(cancelable?: typeof makeCancelable): {
    cancellablePromise: (p: any, controller?: any) => Promise<unknown>;
    cancelPromises: () => void;
};
