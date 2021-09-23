import { DataLine } from "../../../Utility/Data/DataLine";
import { Dataset } from "../../../Utility/Data/Dataset";
import { EmbeddingController } from "./EmbeddingController"

import * as frontend_utils from "../../../../utils/frontend-connect";
import { IVect } from "../../../Utility/Data/Vect";

const Graph = require('graphology');

export class ForceAtlas2EmbeddingController extends EmbeddingController {
    nodes: any

    buildGraph(segments: DataLine[], reuse) {
        let nodes: IVect[] = []
        let edges = []

        let dups = []
        segments.forEach(segment => {
            let prev: IVect = null
            let prevWasDuplicate = false

            segment.vectors.forEach((sample, i) => {
                let fIdx = nodes.findIndex(e => e.x == sample.x && e.y == sample.y)
                let isDuplicate = fIdx >= 0

                if (isDuplicate) {
                    dups.push(sample)
                    // If we have a duplicate, add edge only
                    if (!prevWasDuplicate && i != 0) {
                        edges.push({ source: prev.__meta__.meshIndex, destination: nodes[fIdx].__meta__.meshIndex })
                    }
                    sample.__meta__.duplicateOf = fIdx
                } else {
                    nodes.push(sample)
                    if (i != 0) {
                        edges.push({ source: prev.__meta__.meshIndex, destination: sample.__meta__.meshIndex })
                    }
                    sample.__meta__.duplicateOf = nodes.length - 1
                }

                prevWasDuplicate = isDuplicate
                prev = isDuplicate ? nodes[fIdx] : sample
            })
        })
        return [nodes, edges]
    }



    init(dataset: Dataset, selection: any, params: any) {
        let graph = new Graph()

        const [nodes, edges] = this.buildGraph(dataset.segments, params.seeded)
        this.nodes = nodes

        nodes.forEach(node => {
            if (!params.seeded) {
                node.x = Math.random()
                node.y = Math.random()
            }
            graph.addNode(node.__meta__.meshIndex, {
                x: params.seeded ? node.x : Math.random(),
                y: params.seeded ? node.y : Math.random()
            })
        })
        edges.forEach(edge => {
            graph.addEdge(edge.source, edge.destination)
        })


        this.worker = new Worker(frontend_utils.BASE_PATH + 'forceatlas2.js') //dist/


        let self = this
        this.worker.onmessage = function (e) {
            switch (e.data.type) {
                case 'progress':
                case 'finish':
                    var Y = e.data.positions
                    self.stepper(Y)
                    self.notifier()
                    break
            }

        }
        this.worker.postMessage({
            nodes: nodes.map(e => ({ x: e.x, y: e.y, meshIndex: e.__meta__.meshIndex })),
            edges: edges,
            params: { iterations: params.iterations }
        })
    }

    step() {
        //this.worker.postMessage({
        //    messageType: 'step'
        //})
    }
}