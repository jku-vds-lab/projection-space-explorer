/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import { EntityId, EntityState } from '@reduxjs/toolkit';
import { IEdge } from './Edge';
import { ICluster } from './ICluster';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as Graph from 'graphology';

/**

function* labelGenerator() {
  const code_0 = '0'.charCodeAt(0);
  const code_9 = '9'.charCodeAt(0);
  const code_A = 'A'.charCodeAt(0);
  const code_Z = 'Z'.charCodeAt(0);
  const code_a = 'a'.charCodeAt(0);

  function mapChar(c) {
    if (c >= code_0 && c <= code_9) {
      return String.fromCharCode(code_A + (c - code_0));
    }
    return String.fromCharCode(code_A + (c - code_a));
  }

  let i = 0;

  while (true) {
    const str = i.toString(26);
    const comb = Array.prototype.map.call(str, (e) => mapChar(e.charCodeAt(0))).join('');
    yield comb;
    i += 1;
  }
}






/**
 * Book API.
 */
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
    const visited = {};
    const pathList = [source];
    const output = [];

    function DFS_iter(sourceInner, targetInner, visitedInner, pathListInner: unknown[]) {
      if (sourceInner === targetInner) {
        output.push(pathListInner.slice(0));
        return;
      }

      visitedInner[sourceInner] = true;

      graph.outNeighbors(sourceInner).forEach((neighbor) => {
        if (!visitedInner[neighbor]) {
          pathListInner.push(neighbor);

          DFS_iter(neighbor, targetInner, visitedInner, pathListInner);

          pathListInner.pop();
        }
      });

      visitedInner[sourceInner] = false;
    }

    DFS_iter(source, target, visited, pathList);

    return output.sort((a, b) => a.length - b.length);
  }

  /**
   * Converts this story to a graphology instance.
   */
  static toGraph(story: IBook) {
    const graph = new Graph();

    for (const cluster of Object.keys(story.clusters.entities)) {
      graph.addNode(cluster);
    }

    for (const edge of Object.values(story.edges.entities)) {
      graph.addDirectedEdge(edge.source, edge.destination);
    }

    return graph;
  }

  /**
   * Returns a list of paths that have a common start point.
   *
   * @param source A start label (of a cluster)
   */
  static getAllStoriesFromSource(storybook: IBook, source) {
    const graph = ABook.toGraph(storybook);

    const visited = {};
    const pathList = [source];
    const output = [];

    function DFS_iter(s, visitedInner, pathListInner: unknown[]) {
      if (graph.outNeighbors(s).length === 0) {
        output.push(pathListInner.slice(0));
        return;
      }

      visitedInner[s] = true;

      graph.outNeighbors(s).forEach((neighbor) => {
        if (!visitedInner[neighbor]) {
          pathListInner.push(neighbor);

          DFS_iter(neighbor, visitedInner, pathListInner);

          pathListInner.pop();
        } else {
          output.push(pathListInner.slice(0));
        }
      });

      visitedInner[s] = false;
    }

    DFS_iter(source, visited, pathList);

    return output.sort((a, b) => a.length - b.length);
  }
}

/**
 * Book type.
 */
export interface IBook {
  id: EntityId;
  clusters: EntityState<ICluster>;
  edges: EntityState<IEdge>;
  name?: string;

  metadata?: { [id: string]: any };
}
