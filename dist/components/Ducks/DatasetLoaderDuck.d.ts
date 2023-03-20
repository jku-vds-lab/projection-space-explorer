import { DatasetEntry } from '../../model';
export declare const datasetLoader: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
    isFetching: boolean;
    entry: DatasetEntry;
}>;
export declare const DatasetLoaderActions: {
    fetchDatasetByPath: import("@reduxjs/toolkit").AsyncThunk<void, DatasetEntry, {
        state?: unknown;
        dispatch?: import("redux").Dispatch<import("redux").AnyAction>;
        extra?: unknown;
        rejectValue?: unknown;
        serializedErrorType?: unknown;
        pendingMeta?: unknown;
        fulfilledMeta?: unknown;
        rejectedMeta?: unknown;
    }>;
};
//# sourceMappingURL=DatasetLoaderDuck.d.ts.map