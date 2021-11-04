import { Reducer, Store } from "redux";
import { IVector } from "../../model/Vector";
/**
 * Main api class for PSE.
 */
export declare class API<T> {
    store: Store<T>;
    onStateChanged: any;
    id: string;
    constructor(json: string, reducer: Reducer);
    serialize(): string;
    differenceMiddleware: (store: any) => (next: any) => (action: any) => any;
    createCluster(cluster: any): void;
}
export declare class PluginRegistry {
    private static instance;
    private plugins;
    private reducers;
    private constructor();
    static getInstance(): PluginRegistry;
    getPlugin(type: string): PSEPlugin;
    registerPlugin(plugin: PSEPlugin): void;
    registerReducer(reducer: any): void;
}
export declare abstract class PSEPlugin {
    type: string;
    hasFileLayout(header: string[]): boolean;
    abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
    hasLayout(header: string[], columns: string[]): boolean;
}
