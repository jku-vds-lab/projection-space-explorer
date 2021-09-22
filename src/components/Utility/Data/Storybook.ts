// import { Edge, Graph } from "../graphs";
import { Edge } from "../graphs";
import { ICluster } from "./Cluster";
const Graph = require('graphology');

function* labelGenerator() {
    const code_0 = '0'.charCodeAt(0)
    const code_9 = '9'.charCodeAt(0)
    const code_A = 'A'.charCodeAt(0)
    const code_Z = 'Z'.charCodeAt(0)
    const code_a = 'a'.charCodeAt(0)
    
    
    function mapChar(c) {
        if (c >= code_0 && c <= code_9) {
          return String.fromCharCode(code_A + (c - code_0))
      } else {
          return String.fromCharCode(code_A + (c - code_a))
      }
    }
    
    let i = 0

    while (true) {
        let str = i.toString(26)
        let comb = Array.prototype.map.call(str, e => mapChar(e.charCodeAt(0))).join('')
        yield comb
        i = i + 1
    }
}







/**
 * A story is a list of clusters with a specific order.
 */
export class Storybook {
    clusters: ICluster[];
    edges: Edge[];
    uuid: number;

    static generator = 0;
    
    labelGenerator = labelGenerator()

    constructor(clusters, edges) {
        this.clusters = clusters;
        this.edges = edges;
        Storybook.generator = Storybook.generator + 1;
        this.uuid = Storybook.generator;
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
     * Performs depth first search between a source cluster and a target cluster,
     * returning a list of paths sorted by length.
     * 
     * @param graph 
     * @param source 
     * @param target 
     */
    static depthFirstSearch(graph, source, target) {
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
