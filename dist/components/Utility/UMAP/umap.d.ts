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
import * as matrix from './matrix';
export type DistanceFn = (x: Vector, y: Vector) => number;
export type RandomFn = () => number;
export type EpochCallback = (epoch: number) => boolean | void;
export type Vector = number[];
export type Vectors = Vector[];
export declare const enum TargetMetric {
    categorical = "categorical",
    l1 = "l1",
    l2 = "l2"
}
export interface UMAPParameters {
    /**
     * The distance function with which to assess nearest neighbors, defaults
     * to euclidean distance.
     */
    distanceFn?: DistanceFn;
    /**
     * The initial learning rate for the embedding optimization.
     */
    learningRate?: number;
    /**
     * The local connectivity required -- i.e. the number of nearest
     * neighbors that should be assumed to be connected at a local level.
     * The higher this value the more connected the manifold becomes
     * locally. In practice this should be not more than the local intrinsic
     * dimension of the manifold.
     */
    localConnectivity?: number;
    /**
     * The effective minimum distance between embedded points. Smaller values
     * will result in a more clustered/clumped embedding where nearby points
     * on the manifold are drawn closer together, while larger values will
     * result on a more even dispersal of points. The value should be set
     * relative to the ``spread`` value, which determines the scale at which
     * embedded points will be spread out.
     */
    minDist?: number;
    /**
     * The dimension of the space to embed into. This defaults to 2 to
     * provide easy visualization, but can reasonably be set to any
     * integer value in the range 2 to 100.
     */
    nComponents?: number;
    /**
     * The number of training epochs to be used in optimizing the
     * low dimensional embedding. Larger values result in more accurate
     * embeddings. If None is specified a value will be selected based on
     * the size of the input dataset (200 for large datasets, 500 for small).
     */
    nEpochs?: number;
    /**
     * The size of local neighborhood (in terms of number of neighboring
     * sample points) used for manifold approximation. Larger values
     * result in more global views of the manifold, while smaller
     * values result in more local data being preserved. In general
     * values should be in the range 2 to 100.
     */
    nNeighbors?: number;
    /**
     * The number of negative samples to select per positive sample
     * in the optimization process. Increasing this value will result
     * in greater repulsive force being applied, greater optimization
     * cost, but slightly more accuracy.
     */
    negativeSampleRate?: number;
    /**
     * Weighting applied to negative samples in low dimensional embedding
     * optimization. Values higher than one will result in greater weight
     * being given to negative samples.
     */
    repulsionStrength?: number;
    /**
     * The pseudo-random number generator used by the stochastic parts of the
     * algorithm.
     */
    random?: RandomFn;
    /**
     * Interpolate between (fuzzy) union and intersection as the set operation
     * used to combine local fuzzy simplicial sets to obtain a global fuzzy
     * simplicial sets. Both fuzzy set operations use the product t-norm.
     * The value of this parameter should be between 0.0 and 1.0; a value of
     * 1.0 will use a pure fuzzy union, while 0.0 will use a pure fuzzy
     * intersection.
     */
    setOpMixRatio?: number;
    /**
     * The effective scale of embedded points. In combination with ``min_dist``
     * this determines how clustered/clumped the embedded points are.
     */
    spread?: number;
    /**
     * For transform operations (embedding new points using a trained model)
     * this will control how aggressively to search for nearest neighbors.
     * Larger values will result in slower performance but more accurate
     * nearest neighbor evaluation.
     */
    transformQueueSize?: number;
}
export interface UMAPSupervisedParams {
    /**
     * The metric used to measure distance for a target array is using supervised
     * dimension reduction. By default this is 'categorical' which will measure
     * distance in terms of whether categories match or are different. Furthermore,
     * if semi-supervised is required target values of -1 will be treated as
     * unlabelled under the 'categorical' metric. If the target array takes
     * continuous values (e.g. for a regression problem) then metric of 'l1'
     * or 'l2' is probably more appropriate.
     */
    targetMetric?: TargetMetric;
    /**
     * Weighting factor between data topology and target topology. A value of
     * 0.0 weights entirely on data, a value of 1.0 weights entirely on target.
     * The default of 0.5 balances the weighting equally between data and target.
     */
    targetWeight?: number;
    /**
     * The number of nearest neighbors to use to construct the target simplcial
     * set. Defaults to the `nearestNeighbors` parameter.
     */
    targetNNeighbors?: number;
}
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
export declare class UMAP {
    private learningRate;
    private localConnectivity;
    private minDist;
    private nComponents;
    private nEpochs;
    private nNeighbors;
    private negativeSampleRate;
    private random;
    private repulsionStrength;
    private setOpMixRatio;
    private spread;
    private transformQueueSize;
    private targetMetric;
    private targetWeight;
    private targetNNeighbors;
    private distanceFn;
    private knnIndices?;
    private knnDistances?;
    private graph;
    private X;
    private isInitialized;
    private rpForest;
    private initFromRandom;
    private initFromTree;
    private search;
    private searchGraph;
    private Y?;
    private embedding;
    private optimizationState;
    constructor(params?: UMAPParameters);
    /**
     * Fit the data to a projected embedding space synchronously.
     */
    fit(X: Vectors, initialEmbedding: any): number[][];
    /**
     * Fit the data to a projected embedding space asynchronously, with a callback
     * function invoked on every epoch of optimization.
     */
    fitAsync(X: Vectors, initialEmbedding: any, callback?: (epochNumber: number) => void | boolean): Promise<number[][]>;
    /**
     * Initializes parameters needed for supervised projection.
     */
    setSupervisedProjection(Y: number[], params?: UMAPSupervisedParams): void;
    /**
     * Initializes umap with precomputed KNN indices and distances.
     */
    setPrecomputedKNN(knnIndices: number[][], knnDistances: number[][]): void;
    /**
     * Initializes fit by computing KNN and a fuzzy simplicial set, as well as
     * initializing the projected embeddings. Sets the optimization state ahead
     * of optimization steps. Returns the number of epochs to be used for the
     * SGD optimization.
     */
    initializeFit(X: Vectors, initialEmbedding: any): number;
    private makeSearchFns;
    private makeSearchGraph;
    /**
     * Transforms data to the existing embedding space.
     */
    transform(toTransform: Vectors): Vectors;
    /**
     * Checks if we're using supervised projection, then process the graph
     * accordingly.
     */
    private processGraphForSupervisedProjection;
    /**
     * Manually step through the optimization process one epoch at a time.
     */
    step(): number;
    /**
     * Returns the computed projected embedding.
     */
    getEmbedding(): number[][];
    /**
     * Compute the ``nNeighbors`` nearest points for each data point in ``X``
     * This may be exact, but more likely is approximated via nearest neighbor
     * descent.
     */
    private nearestNeighbors;
    /**
     * Given a set of data X, a neighborhood size, and a measure of distance
     * compute the fuzzy simplicial set (here represented as a fuzzy graph in
     * the form of a sparse matrix) associated to the data. This is done by
     * locally approximating geodesic distance at each point, creating a fuzzy
     * simplicial set for each such point, and then combining all the local
     * fuzzy simplicial sets into a global one via a fuzzy union.
     */
    private fuzzySimplicialSet;
    /**
     * Combine a fuzzy simplicial set with another fuzzy simplicial set
     * generated from categorical data using categorical distances. The target
     * data is assumed to be categorical label data (a vector of labels),
     * and this will update the fuzzy simplicial set to respect that label data.
     */
    private categoricalSimplicialSetIntersection;
    /**
     * Compute a continuous version of the distance to the kth nearest
     * neighbor. That is, this is similar to knn-distance but allows continuous
     * k values rather than requiring an integral k. In esscence we are simply
     * computing the distance such that the cardinality of fuzzy set we generate
     * is k.
     */
    private smoothKNNDistance;
    /**
     * Construct the membership strength data for the 1-skeleton of each local
     * fuzzy simplicial set -- this is formed as a sparse matrix where each row is
     * a local fuzzy simplicial set, with a membership strength for the
     * 1-simplex to each other data point.
     */
    private computeMembershipStrengths;
    /**
     * Initialize a fuzzy simplicial set embedding, using a specified
     * initialisation method and then minimizing the fuzzy set cross entropy
     * between the 1-skeletons of the high and low dimensional fuzzy simplicial
     * sets.
     */
    private initializeSimplicialSetEmbedding;
    /**
     * Given a set of weights and number of epochs generate the number of
     * epochs per sample for each weight.
     */
    private makeEpochsPerSample;
    /**
     * Assigns optimization state parameters from a partial optimization state.
     */
    private assignOptimizationStateParameters;
    /**
     * Sets a few optimization state parameters that are necessary before entering
     * the optimization step loop.
     */
    private prepareForOptimizationLoop;
    /**
     * Initializes optimization state for stepwise optimization.
     */
    private initializeOptimization;
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    private optimizeLayoutStep;
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    private optimizeLayoutAsync;
    /**
     * Improve an embedding using stochastic gradient descent to minimize the
     * fuzzy set cross entropy between the 1-skeletons of the high dimensional
     * and low dimensional fuzzy simplicial sets. In practice this is done by
     * sampling edges based on their membership strength (with the (1-p) terms
     * coming from negative sampling similar to word2vec).
     */
    private optimizeLayout;
    /**
     * Gets the number of epochs for optimizing the projection.
     * NOTE: This heuristic differs from the python version
     */
    private getNEpochs;
}
export declare function jaccard(x: Vector, y: Vector): any;
export declare function euclidean(x: Vector, y: Vector): number;
export declare function cosine(x: Vector, y: Vector): number;
/**
 * Fit a, b params for the differentiable curve used in lower
 * dimensional fuzzy simplicial complex construction. We want the
 * smooth curve (from a pre-defined family with simple gradient) that
 * best matches an offset exponential decay.
 */
export declare function findABParams(spread: number, minDist: number): {
    a: number;
    b: number;
};
/**
 * Under the assumption of categorical distance for the intersecting
 * simplicial set perform a fast intersection.
 */
export declare function fastIntersection(graph: matrix.SparseMatrix, target: number[], unknownDist?: number, farDist?: number): matrix.SparseMatrix;
/**
 * Reset the local connectivity requirement -- each data sample should
 * have complete confidence in at least one 1-simplex in the simplicial set.
 * We can enforce this by locally rescaling confidences, and then remerging the
 * different local simplicial sets together.
 */
export declare function resetLocalConnectivity(simplicialSet: matrix.SparseMatrix): matrix.SparseMatrix;
/**
 * Given indices and weights and an original embeddings
 * initialize the positions of new points relative to the
 * indices and weights (of their neighbors in the source data).
 */
export declare function initTransform(indices: number[][], weights: number[][], embedding: Vectors): number[][];
//# sourceMappingURL=umap.d.ts.map