import { Reducer, Store } from 'redux';
import { RootState } from './Store';
/**
 * Main api class for PSE.
 */
export declare class API<T extends RootState> {
    store: Store<T>;
    onStateChanged: (newState: T, difference: Partial<T>, action: any) => void;
    id: string;
    /**
     * Creates a PSE API (store).
     *
     * @param dump the dump which contains parts of store state
     * @param reducer the root reducer of the store, MUST be created with PSE´s inbuilt createRootReducer method.
     */
    constructor(dump: any, reducer: Reducer<T>);
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
    generateImage(width: number, height: number, padding: number, options: any, ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): Promise<string>;
}
