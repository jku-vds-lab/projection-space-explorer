import { Dataset, IVector } from '../../model';
export declare enum RootActionTypes {
    RESET = "root/RESET",
    HYDRATE = "root/HYDRATE",
    DATASET = "root/DATASET",
    HARD_RESET = "root/HARD_RESET",
    ADD_DATA = "root/ADD_DATA"
}
/** const reset = createAction('root/RESET');
const hydrate = createAction<any>('root/HYDRATE');
const addData = createAction<IVector[]>('root/ADD_DATA');
const loadDataset = createAction<{ dataset: Dataset; dump?: any }>('root/DATASET');
const hardReset = createAction('root/HARD_RESET'); */
export declare const RootActions: {
    reset: () => {
        type: RootActionTypes;
    };
    hydrate: (dump: any) => {
        type: RootActionTypes;
        dump: any;
    };
    addData: <T extends IVector>(data: T) => {
        type: RootActionTypes;
        data: T;
    };
    loadDataset: (dataset: Dataset, dump?: any) => {
        type: RootActionTypes;
        dataset: Dataset;
        dump: any;
    };
    hardReset: () => {
        type: RootActionTypes;
    };
};
//# sourceMappingURL=RootActions.d.ts.map