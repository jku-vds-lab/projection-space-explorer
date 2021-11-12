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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const heap = require("./heap");
const matrix = require("./matrix");
const nnDescent = require("./nn_descent");
const tree = require("./tree");
const utils = require("./utils");
const ml_levenberg_marquardt_1 = require("ml-levenberg-marquardt");
const SMOOTH_K_TOLERANCE = 1e-5;
const MIN_K_DIST_SCALE = 1e-3;
/**
 * UMAP projection system, based on the python implementation from McInnes, L,
 * Healy, J, UMAP: Uniform Manifold Approximation and Projection for Dimension
 * Reduction (https://github.com/lmcinnes/umap).
 *
 * This implementation differs in a few regards:
 * a) The initialization of the embedding for optimization is not computed using
 *    a spectral method, rather it is initialized randomly. This avoids some
 *    computationally intensive matrix eigen computations that aren't easily
 *    ported to JavaScript.
 * b) A lot of "extra" functionality has been omitted from this implementation,
 *    most notably a great deal of alternate distance functions.
 *
 * This implementation provides three methods of reducing dimensionality:
 * 1) fit: fit the data synchronously
 * 2) fitAsync: fit the data asynchronously, with a callback function provided
 *      that is invoked on each optimization step.
 * 3) initializeFit / step: manually initialize the algorithm then explictly
 *      step through each epoch of the SGD optimization
 */
class UMAP {
    constructor(params = {}) {
        this.learningRate = 1.0;
        this.localConnectivity = 1.0;
        this.minDist = 0.1;
        this.nComponents = 2;
        this.nEpochs = 0;
        this.nNeighbors = 15;
        this.negativeSampleRate = 5;
        this.random = Math.random;
        this.repulsionStrength = 1.0;
        this.setOpMixRatio = 1.0;
        this.spread = 1.0;
        this.transformQueueSize = 4.0;
        // Supervised projection params
        this.targetMetric = "categorical" /* categorical */;
        this.targetWeight = 0.5;
        this.targetNNeighbors = this.nNeighbors;
        this.distanceFn = euclidean;
        this.isInitialized = false;
        this.rpForest = [];
        // Projected embedding
        this.embedding = [];
        this.optimizationState = new OptimizationState();
        const setParam = (key) => {
            if (params[key] !== undefined)
                this[key] = params[key];
        };
        setParam('distanceFn');
        setParam('learningRate');
        setParam('localConnectivity');
        setParam('minDist');
        setParam('nComponents');
        setParam('nEpochs');
        setParam('nNeighbors');
        setParam('negativeSampleRate');
        setParam('random');
        setParam('repulsionStrength');
        setParam('setOpMixRatio');
        setParam('spread');
        setParam('transformQueueSize');
    }
    /**
     * Fit the data to a projected embedding space synchronously.
     */
    fit(X, initialEmbedding) {
        this.initializeFit(X, initialEmbedding);
        this.optimizeLayout();
        return this.embedding;
    }
    /**
     * Fit the data to a projected embedding space asynchronously, with a callback
     * function invoked on every epoch of optimization.
     */
    fitAsync(X, initialEmbedding, callback = () => true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeFit(X, initialEmbedding);
            yield this.optimizeLayoutAsync(callback);
            return this.embedding;
        });
    }
    /**
     * Initializes parameters needed for supervised projection.
     */
    setSupervisedProjection(Y, params = {}) {
        this.Y = Y;
        this.targetMetric = params.targetMetric || this.targetMetric;
        this.targetWeight = params.targetWeight || this.targetWeight;
        this.targetNNeighbors = params.targetNNeighbors || this.targetNNeighbors;
    }
    /**
     * Initializes umap with precomputed KNN indices and distances.
     */
    setPrecomputedKNN(knnIndices, knnDistances) {
        this.knnIndices = knnIndices;
        this.knnDistances = knnDistances;
    }
    /**
     * Initializes fit by computing KNN and a fuzzy simplicial set, as well as
     * initializing the projected embeddings. Sets the optimization state ahead
     * of optimization steps. Returns the number of epochs to be used for the
     * SGD optimization.
     */
    initializeFit(X, initialEmbedding) {
        if (X.length <= this.nNeighbors) {
            throw new Error(`Not enough data points (${X.length}) to create nNeighbors: ${this.nNeighbors}.  Add more data points or adjust the configuration.`);
        }
        // We don't need to reinitialize if we've already initialized for this data.
        if (this.X === X && this.isInitialized) {
            return this.getNEpochs();
        }
        this.X = X;
        if (!this.knnIndices && !this.knnDistances) {
            const knnResults = this.nearestNeighbors(X);
            this.knnIndices = knnResults.knnIndices;
            this.knnDistances = knnResults.knnDistances;
        }
        this.graph = this.fuzzySimplicialSet(X, this.nNeighbors, this.setOpMixRatio);
        // Set up the search graph for subsequent transformation.
        this.makeSearchFns();
        this.searchGraph = this.makeSearchGraph(X);
        // Check if supervised projection, then adjust the graph.
        this.processGraphForSupervisedProjection();
        const { head, tail, epochsPerSample, } = this.initializeSimplicialSetEmbedding(initialEmbedding);
        // Set the optimization routine state
        this.optimizationState.head = head;
        this.optimizationState.tail = tail;
        this.optimizationState.epochsPerSample = epochsPerSample;
        // Now, initialize the optimization steps
        this.initializeOptimization();
        this.prepareForOptimizationLoop();
        this.isInitialized = true;
        return this.getNEpochs();
    }
    makeSearchFns() {
        const { initFromTree, initFromRandom } = nnDescent.makeInitializations(this.distanceFn);
        this.initFromTree = initFromTree;
        this.initFromRandom = initFromRandom;
        this.search = nnDescent.makeInitializedNNSearch(this.distanceFn);
    }
    makeSearchGraph(X) {
        const knnIndices = this.knnIndices;
        const knnDistances = this.knnDistances;
        const dims = [X.length, X.length];
        const searchGraph = new matrix.SparseMatrix([], [], [], dims);
        for (let i = 0; i < knnIndices.length; i++) {
            const knn = knnIndices[i];
            const distances = knnDistances[i];
            for (let j = 0; j < knn.length; j++) {
                const neighbor = knn[j];
                const distance = distances[j];
                if (distance > 0) {
                    searchGraph.set(i, neighbor, distance);
                }
            }
        }
        const transpose = matrix.transpose(searchGraph);
        return matrix.maximum(searchGraph, transpose);
    }
    /**
     * Transforms data to the existing embedding space.
     */
    transform(toTransform) {
        // Use the previous rawData
        const rawData = this.X;
        if (rawData === undefined || rawData.length === 0) {
            throw new Error('No data has been fit.');
        }
        let nNeighbors = Math.floor(this.nNeighbors * this.transformQueueSize);
        nNeighbors = Math.min(rawData.length, nNeighbors);
        const init = nnDescent.initializeSearch(this.rpForest, rawData, toTransform, nNeighbors, this.initFromRandom, this.initFromTree, this.random);
        const result = this.search(rawData, this.searchGraph, init, toTransform);
        let { indices, weights: distances } = heap.deheapSort(result);
        indices = indices.map(x => x.slice(0, this.nNeighbors));
        distances = distances.map(x => x.slice(0, this.nNeighbors));
        const adjustedLocalConnectivity = Math.max(0, this.localConnectivity - 1);
        const { sigmas, rhos } = this.smoothKNNDistance(distances, this.nNeighbors, adjustedLocalConnectivity);
        const { rows, cols, vals } = this.computeMembershipStrengths(indices, distances, sigmas, rhos);
        const size = [toTransform.length, rawData.length];
        let graph = new matrix.SparseMatrix(rows, cols, vals, size);
        // This was a very specially constructed graph with constant degree.
        // That lets us do fancy unpacking by reshaping the csr matrix indices
        // and data. Doing so relies on the constant degree assumption!
        const normed = matrix.normalize(graph, "l1" /* l1 */);
        const csrMatrix = matrix.getCSR(normed);
        const nPoints = toTransform.length;
        const eIndices = utils.reshape2d(csrMatrix.indices, nPoints, this.nNeighbors);
        const eWeights = utils.reshape2d(csrMatrix.values, nPoints, this.nNeighbors);
        const embedding = initTransform(eIndices, eWeights, this.embedding);
        const nEpochs = this.nEpochs
            ? this.nEpochs / 3
            : graph.nRows <= 10000
                ? 100
                : 30;
        const graphMax = graph
            .getValues()
            .reduce((max, val) => (val > max ? val : max), 0);
        graph = graph.map(value => (value < graphMax / nEpochs ? 0 : value));
        graph = matrix.eliminateZeros(graph);
        const epochsPerSample = this.makeEpochsPerSample(graph.getValues(), nEpochs);
        const head = graph.getRows();
        const tail = graph.getCols();
        // Initialize optimization slightly differently than the fit method.
        this.assignOptimizationStateParameters({
            headEmbedding: embedding,
            tailEmbedding: this.embedding,
            head,
            tail,
            currentEpoch: 0,
            nEpochs,
            nVertices: graph.getDims()[1],
            epochsPerSample,
        });
        this.prepareForOptimizationLoop();
        return this.optimizeLayout();
    }
    /**
     * Checks if we're using supervised projection, then process the graph
     * accordingly.
     */
    processGraphForSupervisedProjection() {
        const { Y, X } = this;
        if (Y) {
            if (Y.length !== X.length) {
                throw new Error('Length of X and y must be equal');
            }
            if (this.targetMetric === "categorical" /* categorical */) {
                const lt = this.targetWeight < 1.0;
                const farDist = lt ? 2.5 * (1.0 / (1.0 - this.targetWeight)) : 1.0e12;
                this.graph = this.categoricalSimplicialSetIntersection(this.graph, Y, farDist);
            }
            // TODO (andycoenen@): add non-categorical supervised embeddings.
        }
    }
    /**
     * Manually step through the optimization process one epoch at a time.
     */
    step() {
        const { currentEpoch } = this.optimizationState;
        if (currentEpoch < this.getNEpochs()) {
            this.optimizeLayoutStep(currentEpoch);
        }
        return this.optimizationState.currentEpoch;
    }
    /**
     * Returns the computed projected embedding.
     */
    getEmbedding() {
        return this.embedding;
    }
    /**
     * Compute the ``nNeighbors`` nearest points for each data point in ``X``
     * This may be exact, but more likely is approximated via nearest neighbor
     * descent.
     */
    nearestNeighbors(X) {
        const { distanceFn, nNeighbors } = this;
        const log2 = (n) => Math.log(n) / Math.log(2);
        const metricNNDescent = nnDescent.makeNNDescent(distanceFn, this.random);
        // Handle python3 rounding down from 0.5 discrpancy
        const round = (n) => {
            return n === 0.5 ? 0 : Math.round(n);
        };
        const nTrees = 5 + Math.floor(round(X.length ** 0.5 / 20.0));
        const nIters = Math.max(5, Math.floor(Math.round(log2(X.length))));
        this.rpForest = tree.makeForest(X, nNeighbors, nTrees, this.random);
        const leafArray = tree.makeLeafArray(this.rpForest);
        const { indices, weights } = metricNNDescent(X, leafArray, nNeighbors, nIters);
        return { knnIndices: indices, knnDistances: weights };
    }
    /**
     * Given a set of data X, a neighborhood size, and a measure of distance
     * compute the fuzzy simplicial set (here represented as a fuzzy graph in
     * the form of a sparse matrix) associated to the data. This is done by
     * locally approximating geodesic distance at each point, creating a fuzzy
     * simplicial set for each such point, and then combining all the local
     * fuzzy simplicial sets into a global one via a fuzzy union.
     */
    fuzzySimplicialSet(X, nNeighbors, setOpMixRatio = 1.0) {
        const { knnIndices = [], knnDistances = [], localConnectivity } = this;
        const { sigmas, rhos } = this.smoothKNNDistance(knnDistances, nNeighbors, localConnectivity);
        const { rows, cols, vals } = this.computeMembershipStrengths(knnIndices, knnDistances, sigmas, rhos);
        const size = [X.length, X.length];
        const sparseMatrix = new matrix.SparseMatrix(rows, cols, vals, size);
        const transpose = matrix.transpose(sparseMatrix);
        const prodMatrix = matrix.pairwiseMultiply(sparseMatrix, transpose);
        const a = matrix.subtract(matrix.add(sparseMatrix, transpose), prodMatrix);
        const b = matrix.multiplyScalar(a, setOpMixRatio);
        const c = matrix.multiplyScalar(prodMatrix, 1.0 - setOpMixRatio);
        const result = matrix.add(b, c);
        return result;
    }
    /**
     * Combine a fuzzy simplicial set with another fuzzy simplicial set
     * generated from categorical data using categorical distances. The target
     * data is assumed to be categorical label data (a vector of labels),
     * and this will update the fuzzy simplicial set to respect that label data.
     */
    categoricalSimplicialSetIntersection(simplicialSet, target, farDist, unknownDist = 1.0) {
        let intersection = fastIntersection(simplicialSet, target, unknownDist, farDist);
        intersection = matrix.eliminateZeros(intersection);
        return resetLocalConnectivity(intersection);
    }
    /**
     * Compute a continuous version of the distance to the kth nearest
     * neighbor. That is, this is similar to knn-distance but allows continuous
     * k values rather than requiring an integral k. In esscence we are simply
     * computing the distance such that the cardinality of fuzzy set we generate
     * is k.
     */
    smoothKNNDistance(distances, k, localConnectivity = 1.0, nIter = 64, bandwidth = 1.0) {
        const target = (Math.log(k) / Math.log(2)) * bandwidth;
        const rho = utils.zeros(distances.length);
        const result = utils.zeros(distances.length);
        for (let i = 0; i < distances.length; i++) {
            let lo = 0.0;
            let hi = Infinity;
            let mid = 1.0;
            // TODO: This is very inefficient, but will do for now. FIXME
            const ithDistances = distances[i];
            const nonZeroDists = ithDistances.filter(d => d > 0.0);
            if (nonZeroDists.length >= localConnectivity) {
                let index = Math.floor(localConnectivity);
                let interpolation = localConnectivity - index;
                if (index > 0) {
                    rho[i] = nonZeroDists[index - 1];
                    if (interpolation > SMOOTH_K_TOLERANCE) {
                        rho[i] +=
                            interpolation * (nonZeroDists[index] - nonZeroDists[index - 1]);
                    }
                }
                else {
                    rho[i] = interpolation * nonZeroDists[0];
                }
            }
            else if (nonZeroDists.length > 0) {
                rho[i] = utils.max(nonZeroDists);
            }
            for (let n = 0; n < nIter; n++) {
                let psum = 0.0;
                for (let j = 1; j < distances[i].length; j++) {
                    const d = distances[i][j] - rho[i];
                    if (d > 0) {
                        psum += Math.exp(-(d / mid));
                    }
                    else {
                        psum += 1.0;
                    }
                }
                if (Math.abs(psum - target) < SMOOTH_K_TOLERANCE) {
                    break;
                }
                if (psum > target) {
                    hi = mid;
                    mid = (lo + hi) / 2.0;
                }
                else {
                    lo = mid;
                    if (hi === Infinity) {
                        mid *= 2;
                    }
                    else {
                        mid = (lo + hi) / 2.0;
                    }
                }
            }
            result[i] = mid;
            // TODO: This is very inefficient, but will do for now. FIXME
            if (rho[i] > 0.0) {
                const meanIthDistances = utils.mean(ithDistances);
                if (result[i] < MIN_K_DIST_SCALE * meanIthDistances) {
                    result[i] = MIN_K_DIST_SCALE * meanIthDistances;
                }
            }
            else {
                const meanDistances = utils.mean(distances.map(utils.mean));
                if (result[i] < MIN_K_DIST_SCALE * meanDistances) {
                    result[i] = MIN_K_DIST_SCALE * meanDistances;
                }
            }
        }
        return { sigmas: result, rhos: rho };
    }
    /**
     * Construct the membership strength data for the 1-skeleton of each local
     * fuzzy simplicial set -- this is formed as a sparse matrix where each row is
     * a local fuzzy simplicial set, with a membership strength for the
     * 1-simplex to each other data point.
     */
    computeMembershipStrengths(knnIndices, knnDistances, sigmas, rhos) {
        const nSamples = knnIndices.length;
        const nNeighbors = knnIndices[0].length;
        const rows = utils.zeros(nSamples * nNeighbors);
        const cols = utils.zeros(nSamples * nNeighbors);
        const vals = utils.zeros(nSamples * nNeighbors);
        for (let i = 0; i < nSamples; i++) {
            for (let j = 0; j < nNeighbors; j++) {
                let val = 0;
                if (knnIndices[i][j] === -1) {
                    continue; // We didn't get the full knn for i
                }
                if (knnIndices[i][j] === i) {
                    val = 0.0;
                }
                else if (knnDistances[i][j] - rhos[i] <= 0.0) {
                    val = 1.0;
                }
                else {
                    val = Math.exp(-((knnDistances[i][j] - rhos[i]) / sigmas[i]));
                }
                rows[i * nNeighbors + j] = i;
                cols[i * nNeighbors + j] = knnIndices[i][j];
                vals[i * nNeighbors + j] = val;
            }
        }
        return { rows, cols, vals };
    }
    /**
     * Initialize a fuzzy simplicial set embedding, using a specified
     * initialisation method and then minimizing the fuzzy set cross entropy
     * between the 1-skeletons of the high and low dimensional fuzzy simplicial
     * sets.
     */
    initializeSimplicialSetEmbedding(initialEmbedding) {
        const nEpochs = this.getNEpochs();
        const { nComponents } = this;
        const graphValues = this.graph.getValues();
        let graphMax = 0;
        for (let i = 0; i < graphValues.length; i++) {
            const value = graphValues[i];
            if (graphMax < graphValues[i]) {
                graphMax = value;
            }
        }
        const graph = this.graph.map(value => {
            if (value < graphMax / nEpochs) {
                return 0;
            }
            else {
                return value;
            }
        });
        // We're not computing the spectral initialization in this implementation
        // until we determine a better eigenvalue/eigenvector computation
        // approach
        if (initialEmbedding) {
            this.embedding = initialEmbedding;
        }
        else {
            this.embedding = utils.zeros(graph.nRows).map(() => {
                return utils.zeros(nComponents).map(() => {
                    return utils.tauRand(this.random) * 20 + -10; // Random from -10 to 10
                });
            });
        }
        // Get graph data in ordered way...
        const weights = [];
        const head = [];
        const tail = [];
        const rowColValues = graph.getAll();
        for (let i = 0; i < rowColValues.length; i++) {
            const entry = rowColValues[i];
            if (entry.value) {
                weights.push(entry.value);
                tail.push(entry.row);
                head.push(entry.col);
            }
        }
        const epochsPerSample = this.makeEpochsPerSample(weights, nEpochs);
        return { head, tail, epochsPerSample };
    }
    /**
     * Given a set of weights and number of epochs generate the number of
     * epochs per sample for each weight.
     */
    makeEpochsPerSample(weights, nEpochs) {
        const result = utils.filled(weights.length, -1.0);
        const max = utils.max(weights);
        const nSamples = weights.map(w => (w / max) * nEpochs);
        nSamples.forEach((n, i) => {
            if (n > 0)
                result[i] = nEpochs / nSamples[i];
        });
        return result;
    }
    /**
     * Assigns optimization state parameters from a partial optimization state.
     */
    assignOptimizationStateParameters(state) {
        Object.assign(this.optimizationState, state);
    }
    /**
     * Sets a few optimization state parameters that are necessary before entering
     * the optimization step loop.
     */
    prepareForOptimizationLoop() {
        // Hyperparameters
        const { repulsionStrength, learningRate, negativeSampleRate } = this;
        const { epochsPerSample, headEmbedding, tailEmbedding, } = this.optimizationState;
        const dim = headEmbedding[0].length;
        const moveOther = headEmbedding.length === tailEmbedding.length;
        const epochsPerNegativeSample = epochsPerSample.map(e => e / negativeSampleRate);
        const epochOfNextNegativeSample = [...epochsPerNegativeSample];
        const epochOfNextSample = [...epochsPerSample];
        this.assignOptimizationStateParameters({
            epochOfNextSample,
            epochOfNextNegativeSample,
            epochsPerNegativeSample,
            moveOther,
            initialAlpha: learningRate,
            alpha: learningRate,
            gamma: repulsionStrength,
            dim,
        });
    }
    /**
     * Initializes optimization state for stepwise optimization.
     */
    initializeOptimization() {
        // Algorithm state
        const headEmbedding = this.embedding;
        const tailEmbedding = this.embedding;
        // Initialized in initializeSimplicialSetEmbedding()
        const { head, tail, epochsPerSample } = this.optimizationState;
        const nEpochs = this.getNEpochs();
        const nVertices = this.graph.nCols;
        const { a, b } = findABParams(this.spread, this.minDist);
        this.assignOptimizationStateParameters({
            headEmbedding,
            tailEmbedding,
            head,
            tail,
            epochsPerSample,
            a,
            b,
            nEpochs,
            nVertices,
        });
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    optimizeLayoutStep(n) {
        const { optimizationState } = this;
        const { head, tail, headEmbedding, tailEmbedding, epochsPerSample, epochOfNextSample, epochOfNextNegativeSample, epochsPerNegativeSample, moveOther, initialAlpha, alpha, gamma, a, b, dim, nEpochs, nVertices, } = optimizationState;
        const clipValue = 4.0;
        for (let i = 0; i < epochsPerSample.length; i++) {
            if (epochOfNextSample[i] > n) {
                continue;
            }
            const j = head[i];
            const k = tail[i];
            const current = headEmbedding[j];
            const other = tailEmbedding[k];
            const distSquared = rDist(current, other);
            let gradCoeff = 0;
            if (distSquared > 0) {
                gradCoeff = -2.0 * a * b * Math.pow(distSquared, b - 1.0);
                gradCoeff /= a * Math.pow(distSquared, b) + 1.0;
            }
            for (let d = 0; d < dim; d++) {
                const gradD = clip(gradCoeff * (current[d] - other[d]), clipValue);
                current[d] += gradD * alpha;
                if (moveOther) {
                    other[d] += -gradD * alpha;
                }
            }
            epochOfNextSample[i] += epochsPerSample[i];
            const nNegSamples = Math.floor((n - epochOfNextNegativeSample[i]) / epochsPerNegativeSample[i]);
            for (let p = 0; p < nNegSamples; p++) {
                const k = utils.tauRandInt(nVertices, this.random);
                const other = tailEmbedding[k];
                const distSquared = rDist(current, other);
                let gradCoeff = 0.0;
                if (distSquared > 0.0) {
                    gradCoeff = 2.0 * gamma * b;
                    gradCoeff /=
                        (0.001 + distSquared) * (a * Math.pow(distSquared, b) + 1);
                }
                else if (j === k) {
                    continue;
                }
                for (let d = 0; d < dim; d++) {
                    let gradD = 4.0;
                    if (gradCoeff > 0.0) {
                        gradD = clip(gradCoeff * (current[d] - other[d]), clipValue);
                    }
                    current[d] += gradD * alpha;
                }
            }
            epochOfNextNegativeSample[i] += nNegSamples * epochsPerNegativeSample[i];
        }
        optimizationState.alpha = initialAlpha * (1.0 - n / nEpochs);
        optimizationState.currentEpoch += 1;
        return headEmbedding;
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    optimizeLayoutAsync(epochCallback = () => true) {
        return new Promise((resolve, reject) => {
            const step = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { nEpochs, currentEpoch } = this.optimizationState;
                    this.embedding = this.optimizeLayoutStep(currentEpoch);
                    const epochCompleted = this.optimizationState.currentEpoch;
                    const shouldStop = epochCallback(epochCompleted) === false;
                    const isFinished = epochCompleted === nEpochs;
                    if (!shouldStop && !isFinished) {
                        setTimeout(() => step(), 0);
                    }
                    else {
                        return resolve(isFinished);
                    }
                }
                catch (err) {
                    reject(err);
                }
            });
            setTimeout(() => step(), 0);
        });
    }
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    optimizeLayout(epochCallback = () => true) {
        let isFinished = false;
        let embedding = [];
        while (!isFinished) {
            const { nEpochs, currentEpoch } = this.optimizationState;
            embedding = this.optimizeLayoutStep(currentEpoch);
            const epochCompleted = this.optimizationState.currentEpoch;
            const shouldStop = epochCallback(epochCompleted) === false;
            isFinished = epochCompleted === nEpochs || shouldStop;
        }
        return embedding;
    }
    /**
     * Gets the number of epochs for optimizing the projection.
     * NOTE: This heuristic differs from the python version
     */
    getNEpochs() {
        const graph = this.graph;
        if (this.nEpochs > 0) {
            return this.nEpochs;
        }
        const length = graph.nRows;
        if (length <= 2500) {
            return 500;
        }
        else if (length <= 5000) {
            return 400;
        }
        else if (length <= 7500) {
            return 300;
        }
        else {
            return 200;
        }
    }
}
exports.UMAP = UMAP;
// https://github.com/ecto/jaccard TODO: also for tsne and other projection methods
function jaccard(x, y) {
    var jaccard_dist = require('jaccard');
    return jaccard_dist.index(x, y);
}
exports.jaccard = jaccard;
function euclidean(x, y) {
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        result += (x[i] - y[i]) ** 2;
    }
    return Math.sqrt(result);
}
exports.euclidean = euclidean;
function cosine(x, y) {
    let result = 0.0;
    let normX = 0.0;
    let normY = 0.0;
    for (let i = 0; i < x.length; i++) {
        result += x[i] * y[i];
        normX += x[i] ** 2;
        normY += y[i] ** 2;
    }
    if (normX === 0 && normY === 0) {
        return 0;
    }
    else if (normX === 0 || normY === 0) {
        return 1.0;
    }
    else {
        return 1.0 - result / Math.sqrt(normX * normY);
    }
}
exports.cosine = cosine;
/**
 * An interface representing the optimization state tracked between steps of
 * the SGD optimization
 */
class OptimizationState {
    constructor() {
        this.currentEpoch = 0;
        // Data tracked during optimization steps.
        this.headEmbedding = [];
        this.tailEmbedding = [];
        this.head = [];
        this.tail = [];
        this.epochsPerSample = [];
        this.epochOfNextSample = [];
        this.epochOfNextNegativeSample = [];
        this.epochsPerNegativeSample = [];
        this.moveOther = true;
        this.initialAlpha = 1.0;
        this.alpha = 1.0;
        this.gamma = 1.0;
        this.a = 1.5769434603113077;
        this.b = 0.8950608779109733;
        this.dim = 2;
        this.nEpochs = 500;
        this.nVertices = 0;
    }
}
/**
 * Standard clamping of a value into a fixed range
 */
function clip(x, clipValue) {
    if (x > clipValue)
        return clipValue;
    else if (x < -clipValue)
        return -clipValue;
    else
        return x;
}
/**
 * Reduced Euclidean distance.
 */
function rDist(x, y) {
    let result = 0.0;
    for (let i = 0; i < x.length; i++) {
        result += Math.pow(x[i] - y[i], 2);
    }
    return result;
}
/**
 * Fit a, b params for the differentiable curve used in lower
 * dimensional fuzzy simplicial complex construction. We want the
 * smooth curve (from a pre-defined family with simple gradient) that
 * best matches an offset exponential decay.
 */
function findABParams(spread, minDist) {
    const curve = ([a, b]) => (x) => {
        return 1.0 / (1.0 + a * x ** (2 * b));
    };
    const xv = utils
        .linear(0, spread * 3, 300)
        .map(val => (val < minDist ? 1.0 : val));
    const yv = utils.zeros(xv.length).map((val, index) => {
        const gte = xv[index] >= minDist;
        return gte ? Math.exp(-(xv[index] - minDist) / spread) : val;
    });
    const initialValues = [0.5, 0.5];
    const data = { x: xv, y: yv };
    // Default options for the algorithm (from github example)
    const options = {
        damping: 1.5,
        initialValues,
        gradientDifference: 10e-2,
        maxIterations: 100,
        errorTolerance: 10e-3,
    };
    const { parameterValues } = ml_levenberg_marquardt_1.default(data, curve, options);
    const [a, b] = parameterValues;
    return { a, b };
}
exports.findABParams = findABParams;
/**
 * Under the assumption of categorical distance for the intersecting
 * simplicial set perform a fast intersection.
 */
function fastIntersection(graph, target, unknownDist = 1.0, farDist = 5.0) {
    return graph.map((value, row, col) => {
        if (target[row] === -1 || target[col] === -1) {
            return value * Math.exp(-unknownDist);
        }
        else if (target[row] !== target[col]) {
            return value * Math.exp(-farDist);
        }
        else {
            return value;
        }
    });
}
exports.fastIntersection = fastIntersection;
/**
 * Reset the local connectivity requirement -- each data sample should
 * have complete confidence in at least one 1-simplex in the simplicial set.
 * We can enforce this by locally rescaling confidences, and then remerging the
 * different local simplicial sets together.
 */
function resetLocalConnectivity(simplicialSet) {
    simplicialSet = matrix.normalize(simplicialSet, "max" /* max */);
    const transpose = matrix.transpose(simplicialSet);
    const prodMatrix = matrix.pairwiseMultiply(transpose, simplicialSet);
    simplicialSet = matrix.add(simplicialSet, matrix.subtract(transpose, prodMatrix));
    return matrix.eliminateZeros(simplicialSet);
}
exports.resetLocalConnectivity = resetLocalConnectivity;
/**
 * Given indices and weights and an original embeddings
 * initialize the positions of new points relative to the
 * indices and weights (of their neighbors in the source data).
 */
function initTransform(indices, weights, embedding) {
    const result = utils
        .zeros(indices.length)
        .map(z => utils.zeros(embedding[0].length));
    for (let i = 0; i < indices.length; i++) {
        for (let j = 0; j < indices[0].length; j++) {
            for (let d = 0; d < embedding[0].length; d++) {
                const a = indices[i][j];
                result[i][d] += weights[i][j] * embedding[a][d];
            }
        }
    }
    return result;
}
exports.initTransform = initTransform;