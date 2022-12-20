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
 * Internal 2-dimensional sparse matrix class
 */
export declare class SparseMatrix {
    private entries;
    readonly nRows: number;
    readonly nCols: number;
    constructor(rows: number[], cols: number[], values: number[], dims: number[]);
    private makeKey;
    private checkDims;
    set(row: number, col: number, value: number): void;
    get(row: number, col: number, defaultValue?: number): number;
    getAll(ordered?: boolean): {
        value: number;
        row: number;
        col: number;
    }[];
    getDims(): number[];
    getRows(): number[];
    getCols(): number[];
    getValues(): number[];
    forEach(fn: (value: number, row: number, col: number) => void): void;
    map(fn: (value: number, row: number, col: number) => number): SparseMatrix;
    toArray(): number[][];
}
/**
 * Transpose a sparse matrix
 */
export declare function transpose(matrix: SparseMatrix): SparseMatrix;
/**
 * Construct a sparse identity matrix
 */
export declare function identity(size: number[]): SparseMatrix;
/**
 * Element-wise multiplication of two matrices
 */
export declare function pairwiseMultiply(a: SparseMatrix, b: SparseMatrix): SparseMatrix;
/**
 * Element-wise addition of two matrices
 */
export declare function add(a: SparseMatrix, b: SparseMatrix): SparseMatrix;
/**
 * Element-wise subtraction of two matrices
 */
export declare function subtract(a: SparseMatrix, b: SparseMatrix): SparseMatrix;
/**
 * Element-wise maximum of two matrices
 */
export declare function maximum(a: SparseMatrix, b: SparseMatrix): SparseMatrix;
/**
 * Scalar multiplication of two matrices
 */
export declare function multiplyScalar(a: SparseMatrix, scalar: number): SparseMatrix;
/**
 * Returns a new matrix with zero entries removed.
 */
export declare function eliminateZeros(m: SparseMatrix): SparseMatrix;
export declare const enum NormType {
    max = "max",
    l1 = "l1",
    l2 = "l2"
}
/**
 * Normalization of a sparse matrix.
 */
export declare function normalize(m: SparseMatrix, normType?: NormType): SparseMatrix;
/**
 * Helper function for getting data, indices, and inptr arrays from a sparse
 * matrix to follow csr matrix conventions. Super inefficient (and kind of
 * defeats the purpose of this convention) but a lot of the ported python tree
 * search logic depends on this data format.
 */
export declare function getCSR(x: SparseMatrix): {
    indices: number[];
    values: number[];
    indptr: number[];
};
