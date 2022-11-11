export declare const setVisibility: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>;
export declare const setActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const detailView: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
    open: boolean;
    active: string;
}>;
