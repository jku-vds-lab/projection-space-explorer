export interface Loader {
    resolvePath(entry: any, finished: any): any;
    resolveContent(content: any, finished: any): any;
}
