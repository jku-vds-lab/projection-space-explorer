import { DatasetType } from "./DatasetType";
import * as frontend_utils from "../../../utils/frontend-connect";


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
        if(frontend_utils.DEMO && !frontend_utils.CHEM_PROJECT){
            this.data = [
                {
                    display: "Cycle 0",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_0.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 1",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_1.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 2",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_2.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 3",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_3.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 4",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_4.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 5",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_5.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 6",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_6.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 7",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_7.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 8",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_8.csv",
                    type: DatasetType.Experiments_Only
                },
                {
                    display: "Cycle 9",
                    path: "datasets/reaction_optimization/no_suggestions/experiments_9.csv",
                    type: DatasetType.Experiments_Only
                },
                
                {
                    display: "Cycle 0 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_0_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 1 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_1_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 2 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_2_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 3 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_3_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 4 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_4_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 5 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_5_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 6 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_6_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 7 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_7_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 8 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_8_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Cycle 9 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/experiments_9_suggestions.csv",
                    type: DatasetType.Experiments_Only_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 0",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_0.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 1",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_1.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 2",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_2.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 3",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_3.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 4",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_4.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 5",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_5.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 6",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_6.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 7",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_7.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 8",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_8.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 9",
                    path: "datasets/reaction_optimization/no_suggestions/domain_5000_experiments_9.csv",
                    type: DatasetType.Subsampled
                },
                {
                    display: "Subsampled Cycle 0 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_0_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 1 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_1_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 2 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_2_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 3 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_3_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 4 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_4_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 5 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_5_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 6 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_6_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 7 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_7_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 8 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_8_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
                {
                    display: "Subsampled Cycle 9 with Suggestions",
                    path: "datasets/reaction_optimization/suggestions/domain_5000_experiments_9_suggestions.csv",
                    type: DatasetType.Subsampled_with_Sugestions
                },
            ]

        }else{
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
                }
                {
                    display: "Chess: Lichess, metadata, UMAP",
                    path: "datasets/chess/lichess_umap.csv",
                    type: DatasetType.Chess
                },
                {
                    display: "Chess: Lichess, metadata, t-SNE",
                    path: "datasets/chess/lichess_tsne.csv",
                    type: DatasetType.Chess
                },
                {
                    display: "Chess: Lichess, metadata, parametric UMAP custom network",
                    path: "datasets/chess/lichess_umap_seed0_3CNN_2FF.csv",
                    type: DatasetType.Chess
                },
                {
                    display: "Chess: Lichess, metadata, parametric UMAP default network",
                    path: "datasets/chess/lichess_umap_seed0_parametric_default.csv",
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
                    display: "CIME: Test",
                    path: "test.sdf",
                    type: DatasetType.Chem,
                    uploaded: true
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
    }

    getTypes() {
        return [...new Set(this.data.map(value => value.type))];
    }

    getByPath(path) {
        const filtered = this.data.filter(e => e.path == path)[0];
        return filtered ? filtered : this.data[0];
    }
}
