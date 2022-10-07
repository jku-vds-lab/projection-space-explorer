/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable new-cap */
import * as Graph from 'graphology';
import { DataLine } from '../../../model/DataLine';
import { Dataset } from '../../../model/Dataset';
import { EmbeddingController } from './EmbeddingController';

import { IVector } from '../../../model/Vector';

export class ForceAtlas2EmbeddingController extends EmbeddingController {
  nodes: any;

  buildGraph(segments: DataLine[]) {
    const nodes: IVector[] = [];
    const edges = [];

    const dups = [];
    segments.forEach((segment) => {
      let prev: IVector = null;
      let prevWasDuplicate = false;

      segment.vectors.forEach((sample, i) => {
        const fIdx = nodes.findIndex((e) => e.x === sample.x && e.y === sample.y);
        const isDuplicate = fIdx >= 0;

        if (isDuplicate) {
          dups.push(sample);
          // If we have a duplicate, add edge only
          if (!prevWasDuplicate && i !== 0) {
            edges.push({ source: prev.__meta__.meshIndex, destination: nodes[fIdx].__meta__.meshIndex });
          }
          sample.__meta__.duplicateOf = fIdx;
        } else {
          nodes.push(sample);
          if (i !== 0) {
            edges.push({ source: prev.__meta__.meshIndex, destination: sample.__meta__.meshIndex });
          }
          sample.__meta__.duplicateOf = nodes.length - 1;
        }

        prevWasDuplicate = isDuplicate;
        prev = isDuplicate ? nodes[fIdx] : sample;
      });
    });
    return [nodes, edges];
  }

  init(dataset: Dataset, selection: any, params: any) {
    //@ts-ignore
    const graph = new Graph();

    const [nodes, edges] = this.buildGraph(dataset.segments);
    this.nodes = nodes;

    nodes.forEach((node) => {
      if (!params.seeded) {
        node.x = Math.random();
        node.y = Math.random();
      }
      graph.addNode(node.__meta__.meshIndex, {
        x: params.seeded ? node.x : Math.random(),
        y: params.seeded ? node.y : Math.random(),
      });
    });
    edges.forEach((edge) => {
      graph.addEdge(edge.source, edge.destination);
    });

    this.worker = new Worker(new URL('../../workers/embeddings/forceatlas2.worker', import.meta.url));

    const self = this;
    this.worker.onmessage = function (e) {
      switch (e.data.type) {
        case 'progress':
        case 'finish': {
          const Y = e.data.positions;
          self.stepper(Y);
          self.notifier();
          break;
        }
        default:
          break;
      }
    };
    this.worker.postMessage({
      nodes: nodes.map((e) => ({ x: e.x, y: e.y, meshIndex: e.__meta__.meshIndex })),
      edges,
      params: { iterations: params.iterations },
    });
  }

  step() {
    // this.worker.postMessage({
    //    messageType: 'step'
    // })
  }
}
