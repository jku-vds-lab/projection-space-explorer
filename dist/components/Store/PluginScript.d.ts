/// <reference types="react" />
import { Store } from "redux";
import { RootState } from "../Store/Store";
import { IVector } from "../../model/Vector";
/**
 * Main api class for PSE.
 */
export declare class API {
    store: Store<RootState>;
    onStateChanged: any;
    id: string;
    constructor(json?: string);
    serialize(): string;
    differenceMiddleware: (store: any) => (next: any) => (action: any) => any;
    createCluster(cluster: any): void;
}
export declare class PluginRegistry {
    private static instance;
    private plugins;
    private constructor();
    static getInstance(): PluginRegistry;
    getPlugin(type: string): PSEPlugin;
    registerPlugin(plugin: PSEPlugin): void;
}
export declare abstract class PSEPlugin {
    type: string;
    hasFileLayout(header: string[]): boolean;
    abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
    hasLayout(header: string[], columns: string[]): boolean;
}
