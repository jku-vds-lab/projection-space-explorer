// import { Edge, Graph } from "../graphs";
import { Edge } from "./Edge";
import { ICluster } from "./Cluster";
const Graph = require('graphology');
import { v4 as uuidv4 } from 'uuid';

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






export class ABook {
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
     * Converts this story to a graphology instance.
     */
    static toGraph(story: IBook) {
        let graph = new Graph()

        for (const cluster of Object.keys(story.clusters.byId)) {
            graph.addNode(cluster)
        }

        for (const edge of Object.values(story.edges.byId)) {
            graph.addDirectedEdge(edge.source, edge.destination)
        }

        return graph
    }


    /**
     * Returns a list of paths that have a common start point.
     * 
     * @param source A start label (of a cluster)
     */
    static getAllStoriesFromSource(storybook: IBook, source) {
        let graph = ABook.toGraph(storybook)

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


    static getCluster(storybook: IBook, index: string) {
        return storybook.clusters.byId[index]
    }

    static createEmpty(): IBook {
        return {
            clusters: {
                byId: {},
                allIds: []
            },
            edges: {
                byId: {},
                allIds: []
            }
        }
    }

    static addCluster(story: IBook, cluster: ICluster) {
        const handle = uuidv4()

        story.clusters.byId[handle] = cluster
        story.clusters.allIds.push(handle)

        return handle
    }

}


export interface IBook {
    clusters: {
        byId: { [id: string]: ICluster; }
        allIds: string[]
    }
    edges: {
        byId: { [id: string]: Edge; }
        allIds: string[]
    }
}