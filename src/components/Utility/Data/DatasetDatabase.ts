import { DatasetType } from "./DatasetType";


export type DatasetEntry = {
    display: string
    path: string
    type: DatasetType
    uploaded?: boolean
}



/**
 * Dummy class that holds information about the files that can be preselected.
 */


export class DatasetDatabase {
    data: DatasetEntry[];

    constructor() {
        this.data = [
          {
              display: "Iris",
              path: "datasets/toy/iris.csv",
              type: DatasetType.Toy
          },
          {
              display: "Penguins",
              path: "datasets/penguins/penguins_without_nan.csv",
              type: DatasetType.Toy
          },
          {
              display: "TCGA Lung, Colorectal, and Pancreatic Cancer",
              path: "datasets/coral/coral_usecase_3TumorTypes_expression_normalized_no_one_hot.json",
              type: DatasetType.Cohort_Analysis
          },
            {
                display: "Chess: 190 Games",
                path: "datasets/chess/chess16k.csv",
                type: DatasetType.Chess
            },
            {
                display: "Chess: 450 Games",
                path: "datasets/chess/chess40k_groups.json",
                type: DatasetType.Chess
            },
            {
                display: "Chess: AlphaZero vs Stockfish",
                path: "datasets/chess/alphazero.csv",
                type: DatasetType.Chess
            },
            {
                display: "Chess: AlphaZero vs Stockfish, metadata, t-SNE",
                path: "datasets/chess/alphazero_tsne.csv",
                type: DatasetType.Chess
            },
            {
                display: "Chess: AlphaZero vs Stockfish, metadata, UMAP",
                path: "datasets/chess/alphazero_umap.csv",
                type: DatasetType.Chess
            },
            {
                display: "Rubik: 1x2 Different Origins",
                path: "datasets/rubik/cube1x2_different_origins.csv",
                type: DatasetType.Rubik
            },
            {
                display: "Rubik: 1x2 Same Origins",
                path: "datasets/rubik/cube1x2.csv",
                type: DatasetType.Rubik
            },
            {
                display: "Rubik: 10x2 Different Origins",
                path: "datasets/rubik/cube10x2_different_origins.csv",
                type: DatasetType.Rubik
            },
            {
                display: "Rubik: 10x2 Same Origins",
                path: "datasets/rubik/cube10x2.csv",
                type: DatasetType.Rubik
            },
            {
                display: "Rubik: 100x2 Different Origins",
                path: "datasets/rubik/cube100x2_different_origins.csv",
                type: DatasetType.Rubik
            },
            {
                display: "Rubik: 100x2 Same Origins",
                path: "datasets/rubik/cube100x2.csv",
                type: DatasetType.Rubik
            },
            {
                display: "NN: Rnd Weights",
                path: "datasets/neural/random_weights.csv",
                type: DatasetType.Neural
            },
            {
                display: "NN: Rnd Confusion Matrix",
                path: "datasets/neural/random_confmat.csv",
                type: DatasetType.Neural
            },
            {
                display: "NN: Weights",
                path: "datasets/neural/learning_weights.csv",
                type: DatasetType.Neural
            },
            {
                display: "NN: Confusion Matrix",
                path: "datasets/neural/learning_confmat.csv",
                type: DatasetType.Neural
            },
            {
                display: "Go: State features",
                path: "datasets/go/combined.csv",
                type: DatasetType.Go
            },
            {
                display: "Go: Histogram features",
                path: "datasets/go/histogram.csv",
                type: DatasetType.Go
            },
            {
                display: "Go: Move features (wavelet)",
                path: "datasets/go/move_wavelet.csv",
                type: DatasetType.Go
            }
        ];
    }

    getTypes() {
        return [...new Set(this.data.map(value => value.type))];
    }

    getByPath(path) {
        return this.data.filter(e => e.path == path)[0];
    }
}
