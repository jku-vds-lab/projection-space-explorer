import { Edge } from "./graphs";
import Cluster from "./Cluster";

/**
 * A story is a list of clusters with a specific order.
 */
export class Story {
    clusters: Cluster[];
    edges: Edge[];
    uuid: number;

    static generator = 0;

    constructor(clusters, edges) {
        this.clusters = clusters;
        this.edges = edges;
        Story.generator = Story.generator + 1;
        this.uuid = Story.generator;
    }

    getId() {
        return this.uuid;
    }
}
