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
                display: "Coral sub-sampled",
                path: "datasets/coral/coral_subsampled.json",
                type: DatasetType.Coral
            },
            {
                display: "Coral sub-sampled normalized",
                path: "datasets/coral/coral_subsampled_normalized.json",
                type: DatasetType.Coral
            },
            {
                display: "Coral no one-hot encoding",
                path: "datasets/coral/coral_subsampled_no_one_hot.json",
                type: DatasetType.Coral
            },
            {
                display: "Coral no one-hot encoding normalized",
                path: "datasets/coral/coral_subsampled_normalized_no_one_hot.json",
                type: DatasetType.Coral
            },
            {
                display: "Chess: 190 Games",
                path: "datasets/chess/chess16k.csv",
                type: DatasetType.Chess
            },
            {
                display: "Chess: 450 Games",
                path: "datasets/chess/chess40k.csv",
                type: DatasetType.Chess
            },
            {
                display: "Chess: AlphaZero vs Stockfish",
                path: "datasets/chess/alphazero.csv",
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
                display: "Story: With Names",
                path: "datasets/story/withnames.csv",
                type: DatasetType.Story
            },
            {
                display: "Story: No Duplicates",
                path: "datasets/story/stories_dup-del_p50_with-names.csv",
                type: DatasetType.Story
            },
            {
                display: "Story: Test",
                path: "datasets/story/teststories.csv",
                type: DatasetType.Story
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
            },
            {
                display: "Toy: Iris",
                path: "datasets/toy/iris.csv",
                type: DatasetType.None
            },
            {
                display: "Toy: Story",
                path: "datasets/toy/toy.csv",
                type: DatasetType.None
            },
            {
                display: "Toy: Story",
                path: "datasets/toy/toy.csv",
                type: DatasetType.None
            },
            {
                display: "CIME: Test",
                path: "test.sdf",
                type: DatasetType.Chem,
                uploaded: true
            },
        ];
    }

    getTypes() {
        return [...new Set(this.data.map(value => value.type))];
    }

    getByPath(path) {
        return this.data.filter(e => e.path == path)[0];
    }
}
