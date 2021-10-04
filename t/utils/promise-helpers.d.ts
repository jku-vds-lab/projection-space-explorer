export declare function makeCancelable(promise: any): {
    promise: Promise<unknown>;
    cancel(): void;
};
export default function useCancellablePromise(cancelable?: typeof makeCancelable): {
    cancellablePromise: (p: any, controller?: any) => Promise<unknown>;
    cancelPromises: () => void;
};
