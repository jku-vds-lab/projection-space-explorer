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
            // {
            //     display: "Rubik: 10x2 Different Origins",
            //     path: "datasets/rubik/cube10x2_different_origins.csv",
            //     type: DatasetType.Rubik
            // },
            {
                display: "Gapminder: Synthetic MDS",
                path: "datasets/story/new_artificial_MDS_now.csv",
                type: DatasetType.Story
            },
            {
                display: "Gapminder: Synthetic t-SNE",
                path: "datasets/story/new_artificial_tSNE_now.csv",
                type: DatasetType.Story
            },            
            {
                display: "Gapminder: Synthetic t-SNE (w_num=5)",
                path: "datasets/story/new_our_artificial_tSNE_wy5.csv",
                type: DatasetType.Story
            },
            {
                display: "Gapminder: Synthetic UMAP",
                path: "datasets/story/new_artificial_UMAP_now.csv",
                type: DatasetType.Story
            },            
            {
                display: "Gapminder: User MDS",
                path: "datasets/story/new_stories_MDS_now.csv",
                type: DatasetType.Story
            },           
            {
                display: "Gapminder: User t-SNE",
                path: "datasets/story/new_stories_tSNE_now.csv",
                type: DatasetType.Story
            },           
            {
                display: "Gapminder: User UMAP",
                path: "datasets/story/new_stories_UMAP_now.csv",
                type: DatasetType.Story
            },
            {
                display: "User Intent: All Outlier + Cluster",
                path: "datasets/trrack/pse-csv/trrack_stories_all.csv",
                type: DatasetType.Trrack
            },
            // {
            //     display: "User Intent: All Track Stories Updated",
            //     path: "datasets/trrack/all_trrack_stories_updated.csv",
            //     type: DatasetType.Trrack
            // },        
            {
                display: "User Intent: Outlier All",
                path: "ddatasets/trrack/pse-csv/trrack_stories_all-outlier.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Cluster) E1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-23.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Cluster) E2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-24.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-25.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-26.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E3",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-27.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Cluster) M1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-29.csv",
                type: DatasetType.Trrack
            },        
            {
                display: "User Intent: Outlier (Cluster) M2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-30.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) M1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-31.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) M1 - Single User",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-32-5d02ed8f7a3c0f0015cd3230.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) M2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-32.csv",
                type: DatasetType.Trrack
            },
            // {
            //     display: "User Intent: Outlier H-Training",
            //     path: "datasets/trrack/trrack_stories_task-outlier-34_dupl_removed.csv",
            //     type: DatasetType.Trrack
            // },
            {
                display: "User Intent: Outlier (Cluster) H1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-34.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Cluster) H2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-36.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) H1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-37.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) H2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-outlier-38.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Cluster All",
                path: "datasets/trrack/pse-csv/trrack_stories_all-cluster.csv",
                type: DatasetType.Trrack
            },        
            {
                display: "User Intent: Cluster E1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-1.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Cluster E2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-2.csv",
                type: DatasetType.Trrack
            },         
            {
                display: "User Intent: Cluster M1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-4.csv",
                type: DatasetType.Trrack
            },         
            {
                display: "User Intent: Cluster M2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-5.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Cluster H-Training",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-6.csv",
                type: DatasetType.Trrack
            },        
            {
                display: "User Intent: Cluster H1",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-7.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Cluster H2",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-8.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Cluster H2 Single User",
                path: "datasets/trrack/pse-csv/trrack_stories_task-cluster-8-5d6927928a415c00194dfb6f.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E2 - Hybrid alpha000",
                path: "datasets/trrack/hybrid-tests/hybrid-test_alpha000.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E2 - Hybrid alpha100",
                path: "datasets/trrack/hybrid-tests/hybrid-test_alpha100.csv",
                type: DatasetType.Trrack
            },
            {
                display: "User Intent: Outlier (Linear) E2 - Hybrid alpha019",
                path: "datasets/trrack/hybrid-tests/hybrid-test_alpha019.csv",
                type: DatasetType.Trrack
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
