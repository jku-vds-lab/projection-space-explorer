import { EntityId, EntityState } from '@reduxjs/toolkit';
import { IEdge } from './Edge';
import { ICluster } from './ICluster';
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
}
/**
 * Book type.
 */
export interface IBook {
    id: EntityId;
    clusters: EntityState<ICluster>;
    edges: EntityState<IEdge>;
    name?: string;
    metadata?: {
        [id: string]: any;
    };
}
