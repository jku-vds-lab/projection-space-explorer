import { DatasetType } from "../../../model/DatasetType";


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
                display: "CIME: Reaction Optimization 5000",
                path: "datasets/chemvis/domain_5000_all_predictions.csv",
                type: DatasetType.None
            },
            {
                display: "CIME: Reaction Optimization 10000",
                path: "datasets/chemvis/domain_10000_all_predictions.csv",
                type: DatasetType.None
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
                display: "Chess: 450 Games (Groups)",
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
                display: "Trrack: All Track Stories Updated",
                path: "datasets/trrack/all_trrack_stories_updated.csv",
                type: DatasetType.Trrack
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
                display: "Penguins",
                path: "datasets/penguins/penguins_without_nan.csv",
                type: DatasetType.None
            },
            {
                display: "Cohort: TCGA Sub-sampled",
                path: "datasets/coral/coral_subsampled_normalized_no_one_hot.json",
                type: DatasetType.Cohort_Analysis
            },
            {
                display: "Cohort: TCGA Lung, Colorectal, and Pancreatic Cancer",
                path: "datasets/coral/coral_usecase_3TumorTypes_expression_normalized_no_one_hot.json",
                type: DatasetType.Cohort_Analysis
            },
        ];
    }

    getTypes() {
        return [...new Set(this.data.map(value => value.type))];
    }

    getByPath(path) {
        const filtered = this.data.filter(e => e.path == path)[0];
        return filtered ? filtered : this.data[0];
    }
}
