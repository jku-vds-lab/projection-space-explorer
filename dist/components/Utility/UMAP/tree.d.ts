/**
 * @license
 *
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==============================================================================
 */
import { RandomFn, Vector, Vectors } from './umap';
export declare class FlatTree {
    hyperplanes: number[][];
    offsets: number[];
    children: number[][];
    indices: number[][];
    constructor(hyperplanes: number[][], offsets: number[], children: number[][], indices: number[][]);
}
/**
 * Build a random projection forest with ``nTrees``.
 */
export declare function makeForest(data: Vectors, nNeighbors: number, nTrees: number, random: RandomFn): FlatTree[];
/**
 * Generate an array of sets of candidate nearest neighbors by
 * constructing a random projection forest and taking the leaves of all the
 * trees. Any given tree has leaves that are a set of potential nearest
 * neighbors. Given enough trees the set of all such leaves gives a good
 * likelihood of getting a good set of nearest neighbors in composite. Since
 * such a random projection forest is inexpensive to compute, this can be a
 * useful means of seeding other nearest neighbor algorithms.
 */
export declare function makeLeafArray(rpForest: FlatTree[]): number[][];
/**
 * Searches a flattened rp-tree for a point.
 */
export declare function searchFlatTree(point: Vector, tree: FlatTree, random: RandomFn): number[];
