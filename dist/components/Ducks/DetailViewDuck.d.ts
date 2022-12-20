export declare const detailView: import("redux").Reducer<{
    open: boolean;
    active: number;
}, import("redux").AnyAction>;
export declare const DetailViewActions: {
    setDetailVisibility: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>;
    setDetailView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
};
