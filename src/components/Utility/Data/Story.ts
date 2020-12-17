import { Edge, Graph } from "../graphs";
import Cluster from "./Cluster";
const Graph = require('graphology');

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


    /**
     * Converts this story to a graphology instance.
     */
    toGraph() {
        let graph = new Graph()

        this.clusters.forEach(cluster => {
            graph.addNode(cluster.label)
        })
        this.edges.forEach(edge => {
            graph.addDirectedEdge(edge.source.label, edge.destination.label)
        })

        return graph
    }



    /**
     * Returns a list of paths from source to target.
     * 
     * @param source The source cluster label
     * @param target The target cluster label
     */
    getAllStoriesFromSourceToTarget(source, target) {
        let graph = this.toGraph()

        let visited = {}
        let pathList = [source]
        let output = []

        DFS_iter(source, target, visited, pathList)

        function DFS_iter(source, target, visited, pathList: any[]) {
            if (source == target) {
                output.push(pathList.slice(0))
                return;
            }

            visited[source] = true

            graph.outNeighbors(source).forEach(neighbor => {
                if (!visited[neighbor]) {
                    pathList.push(neighbor)

                    DFS_iter(neighbor, target, visited, pathList)

                    pathList.pop()
                }
            })

            visited[source] = false
        }

        return output.sort((a, b) => a.length - b.length)
    }




    /**
     * Returns a list of paths that have a common start point.
     * 
     * @param source A start label (of a cluster)
     */
    getAllStoriesFromSource(source) {
        let graph = this.toGraph()

        let visited = {}
        let pathList = [source]
        let output = []

        DFS_iter(source, visited, pathList)

        function DFS_iter(s, visited, pathList: any[]) {
            if (graph.outNeighbors(s).length == 0) {
                output.push(pathList.slice(0))
                return;
            }

            visited[s] = true

            graph.outNeighbors(s).forEach(neighbor => {
                if (!visited[neighbor]) {
                    pathList.push(neighbor)

                    DFS_iter(neighbor, visited, pathList)

                    pathList.pop()
                } else {
                    output.push(pathList.slice(0))
                }
            })

            visited[s] = false
        }

        return output.sort((a, b) => a.length - b.length)
    }
}
