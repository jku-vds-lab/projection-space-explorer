import { PSEPlugin } from './PSEPlugin';
export declare function getStoreDiff(storeA: any, storeB: any): {};
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
