export interface Loader {
    resolvePath(entry, finished)
    resolveContent(content, finished)

    
}