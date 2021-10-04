import { IEdge } from "./Edge";
import { ICluster } from "./Cluster";
/**
 * Book methods.
 */
export declare class ABook {
    /**
     * Performs depth first search between a source cluster and a target cluster,
     * returning a list of paths sorted by length.
     *
     * @param graph
     * @param source
     * @param target
     */
    static depthFirstSearch(graph: any, source: any, target: any): any[];
    /**
     * Converts this story to a graphology instance.
     */
    static toGraph(story: IBook): any;
    /**
     * Returns a list of paths that have a common start point.
     *
     * @param source A start label (of a cluster)
     */
    static getAllStoriesFromSource(storybook: IBook, source: any): any[];
    static getCluster(book: IBook, index: string): ICluster;
    static createEmpty(): IBook;
    static addCluster(book: IBook, cluster: ICluster): any;
    static deleteEdge(book: IBook, edge: IEdge): string;
    static addEdge(book: IBook, edge: IEdge): any;
    static deleteCluster(book: IBook, cluster: ICluster): string;
}
/**
 * Book type.
 */
export interface IBook {
    clusters: {
        byId: {
            [id: string]: ICluster;
        };
        allIds: string[];
    };
    edges: {
        byId: {
            [id: string]: IEdge;
        };
        allIds: string[];
    };
}
