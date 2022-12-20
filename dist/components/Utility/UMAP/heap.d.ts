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
/**
 * This is a JavaScript reimplementation of UMAP (original license below), from
 * the python implementation found at https://github.com/lmcinnes/umap.
 *
 * @author andycoenen@google.com (Andy Coenen)
 */
/**
 * @license
 * BSD 3-Clause License
 *
 * Copyright (c) 2017, Leland McInnes
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import { RandomFn } from './umap';
export type Heap = number[][][];
/**
 *  Constructor for the heap objects. The heaps are used
 * for approximate nearest neighbor search, maintaining a list of potential
 * neighbors sorted by their distance. We also flag if potential neighbors
 * are newly added to the list or not. Internally this is stored as
 * a single array; the first axis determines whether we are looking at the
 * array of candidate indices, the array of distances, or the flag array for
 * whether elements are new or not. Each of these arrays are of shape
 * (``nPoints``, ``size``)
 */
export declare function makeHeap(nPoints: number, size: number): Heap;
/**
 * Generate n_samples many integers from 0 to pool_size such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */
export declare function rejectionSample(nSamples: number, poolSize: number, random: RandomFn): number[];
/**
 * Push a new element onto the heap. The heap stores potential neighbors
 * for each data point. The ``row`` parameter determines which data point we
 * are addressing, the ``weight`` determines the distance (for heap sorting),
 * the ``index`` is the element to add, and the flag determines whether this
 * is to be considered a new addition.
 */
export declare function heapPush(heap: Heap, row: number, weight: number, index: number, flag: number): number;
/**
 * Push a new element onto the heap. The heap stores potential neighbors
 * for each data point. The ``row`` parameter determines which data point we
 * are addressing, the ``weight`` determines the distance (for heap sorting),
 * the ``index`` is the element to add, and the flag determines whether this
 * is to be considered a new addition.
 */
export declare function uncheckedHeapPush(heap: Heap, row: number, weight: number, index: number, flag: number): number;
/**
 * Build a heap of candidate neighbors for nearest neighbor descent. For
 * each vertex the candidate neighbors are any current neighbors, and any
 * vertices that have the vertex as one of their nearest neighbors.
 */
export declare function buildCandidates(currentGraph: Heap, nVertices: number, nNeighbors: number, maxCandidates: number, random: RandomFn): Heap;
/**
 * Given an array of heaps (of indices and weights), unpack the heap
 * out to give and array of sorted lists of indices and weights by increasing
 * weight. This is effectively just the second half of heap sort (the first
 * half not being required since we already have the data in a heap).
 */
export declare function deheapSort(heap: Heap): {
    indices: number[][];
    weights: number[][];
};
/**
 * Search the heap for the smallest element that is still flagged.
 */
export declare function smallestFlagged(heap: Heap, row: number): number;
