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
import { RandomFn } from './umap';
/**
 * Simple random integer function
 */
export declare function tauRandInt(n: number, random: RandomFn): number;
/**
 * Simple random float function
 */
export declare function tauRand(random: RandomFn): number;
/**
 * Compute the (standard l2) norm of a vector.
 */
export declare function norm(vec: number[]): number;
/**
 * Creates an empty array (filled with undefined)
 */
export declare function empty(n: number): undefined[];
/**
 * Creates an array filled with index values
 */
export declare function range(n: number): number[];
/**
 * Creates an array filled with a specific value
 */
export declare function filled(n: number, v: number): number[];
/**
 * Creates an array filled with zeros
 */
export declare function zeros(n: number): number[];
/**
 * Creates an array filled with ones
 */
export declare function ones(n: number): number[];
/**
 * Creates an array from a to b, of length len, inclusive
 */
export declare function linear(a: number, b: number, len: number): number[];
/**
 * Returns the sum of an array
 */
export declare function sum(input: number[]): number;
/**
 * Returns the mean of an array
 */
export declare function mean(input: number[]): number;
/**
 * Returns the maximum value of an array
 */
export declare function max(input: number[]): number;
/**
 * Returns the maximum value of a 2d array
 */
export declare function max2d(input: number[][]): number;
/**
 * Generate nSamples many integers from 0 to poolSize such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */
export declare function rejectionSample(nSamples: number, poolSize: number, random: RandomFn): number[];
/**
 * Reshapes a 1d array into a 2D of given dimensions.
 */
export declare function reshape2d<T>(x: T[], a: number, b: number): T[][];
//# sourceMappingURL=utils.d.ts.map