import { Dataset } from '../../model';
export declare enum RootActionTypes {
    RESET = "root/RESET",
    HYDRATE = "root/HYDRATE",
    DATASET = "root/DATASET",
    HARD_RESET = "root/HARD_RESET"
}
export declare const RootActions: {
    reset: () => {
        type: RootActionTypes;
    };
    hydrate: (dump: any) => {
        type: RootActionTypes;
        dump: any;
    };
    loadDataset: (dataset: Dataset) => {
        type: RootActionTypes;
        dataset: Dataset;
    };
    hardReset: () => {
        type: RootActionTypes;
    };
};
