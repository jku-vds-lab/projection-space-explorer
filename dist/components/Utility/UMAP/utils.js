"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple random integer function
 */
function tauRandInt(n, random) {
    return Math.floor(random() * n);
}
exports.tauRandInt = tauRandInt;
/**
 * Simple random float function
 */
function tauRand(random) {
    return random();
}
exports.tauRand = tauRand;
/**
 * Compute the (standard l2) norm of a vector.
 */
function norm(vec) {
    let result = 0;
    for (let item of vec) {
        result += item ** 2;
    }
    return Math.sqrt(result);
}
exports.norm = norm;
/**
 * Creates an empty array (filled with undefined)
 */
function empty(n) {
    const output = [];
    for (let i = 0; i < n; i++) {
        output.push(undefined);
    }
    return output;
}
exports.empty = empty;
/**
 * Creates an array filled with index values
 */
function range(n) {
    return empty(n).map((_, i) => i);
}
exports.range = range;
/**
 * Creates an array filled with a specific value
 */
function filled(n, v) {
    return empty(n).map(() => v);
}
exports.filled = filled;
/**
 * Creates an array filled with zeros
 */
function zeros(n) {
    return filled(n, 0);
}
exports.zeros = zeros;
/**
 * Creates an array filled with ones
 */
function ones(n) {
    return filled(n, 1);
}
exports.ones = ones;
/**
 * Creates an array from a to b, of length len, inclusive
 */
function linear(a, b, len) {
    return empty(len).map((_, i) => {
        return a + i * ((b - a) / (len - 1));
    });
}
exports.linear = linear;
/**
 * Returns the sum of an array
 */
function sum(input) {
    return input.reduce((sum, val) => sum + val);
}
exports.sum = sum;
/**
 * Returns the mean of an array
 */
function mean(input) {
    return sum(input) / input.length;
}
exports.mean = mean;
/**
 * Returns the maximum value of an array
 */
function max(input) {
    let max = 0;
    for (let i = 0; i < input.length; i++) {
        max = input[i] > max ? input[i] : max;
    }
    return max;
}
exports.max = max;
/**
 * Returns the maximum value of a 2d array
 */
function max2d(input) {
    let max = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            max = input[i][j] > max ? input[i][j] : max;
        }
    }
    return max;
}
exports.max2d = max2d;
/**
 * Generate nSamples many integers from 0 to poolSize such that no
 * integer is selected twice. The duplication constraint is achieved via
 * rejection sampling.
 */
function rejectionSample(nSamples, poolSize, random) {
    const result = zeros(nSamples);
    for (let i = 0; i < nSamples; i++) {
        let rejectSample = true;
        while (rejectSample) {
            const j = tauRandInt(poolSize, random);
            let broken = false;
            for (let k = 0; k < i; k++) {
                if (j === result[k]) {
                    broken = true;
                    break;
                }
            }
            if (!broken) {
                rejectSample = false;
            }
            result[i] = j;
        }
    }
    return result;
}
exports.rejectionSample = rejectionSample;
/**
 * Reshapes a 1d array into a 2D of given dimensions.
 */
function reshape2d(x, a, b) {
    const rows = [];
    let count = 0;
    let index = 0;
    if (x.length !== a * b) {
        throw new Error('Array dimensions must match input length.');
    }
    for (let i = 0; i < a; i++) {
        const col = [];
        for (let j = 0; j < b; j++) {
            col.push(x[index]);
            index += 1;
        }
        rows.push(col);
        count += 1;
    }
    return rows;
}
exports.reshape2d = reshape2d;
