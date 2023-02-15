export declare const tabSettings: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<{
    openTab: number;
    focusedTab: number[];
}>;
export declare const TabActions: {
    setOpenTab: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
    disableOthers: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        tabs: number[];
    }, string>;
};
//# sourceMappingURL=OpenTabDuck.d.ts.map