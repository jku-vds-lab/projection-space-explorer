/**
 * Directed graph library for javascript.
 */
import { ICluster } from '../../model/ICluster';
import { Dataset } from '../../model/Dataset';
import { IBook } from '../../model/Book';
import { IEdge } from '../../model/Edge';
export declare function transformIndicesToHandles(clusterResult: ICluster[], edgeResult?: IEdge[]): IBook;
/**
 * Performs a basic path bundling algorithm and tries to extract
 * the most prominent edges between clusters.
 *
 * @param {Dataset} dataset the current dataset
 * @param {ICluster[]} clusters a list of clusters to perform the edge extraction
 */
export declare function graphLayout(dataset: Dataset, clusters: ICluster[]): IEdge[][];
export declare function storyLayout(clusterInstances: ICluster[], edges: IEdge[]): IBook[];
//# sourceMappingURL=graphs.d.ts.map