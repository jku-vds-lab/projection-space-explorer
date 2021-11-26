import { Reducer, Store } from "redux";
/**
 * Main api class for PSE.
 */
export declare class API<T> {
    store: Store<T>;
    onStateChanged: any;
    id: string;
    /**
     * Creates a PSE API (store).
     *
     * @param dump the dump which contains parts of store state
     * @param reducer the root reducer of the store, MUST be created with PSE´s inbuilt createRootReducer method.
     */
    constructor(dump: any, reducer: Reducer);
    /**
     * Performs a partial store change.
     * This operation can have side effects depending on which parts you change that can break the app
     * (for example changing the dataset when there are still clusters)
     */
    partialHydrate(dump: any): void;
    reset(): void;
    serialize(): string;
    /**
     * Creates a partial dump which excludes a list of columns.
     */
    partialDump(excluded: string[]): any;
    differenceMiddleware: (store: any) => (next: any) => (action: any) => any;
}
