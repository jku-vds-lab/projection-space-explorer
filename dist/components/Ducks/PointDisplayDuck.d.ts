import { PayloadAction } from '@reduxjs/toolkit';
declare type ICheckedMarks = {
    'star': boolean;
    'cross': boolean;
    'circle': boolean;
    'square': boolean;
};
declare type IPointDisplay = {
    checkedShapes: ICheckedMarks;
};
export declare const PointDisplayActions: import("@reduxjs/toolkit").CaseReducerActions<{
    setCheckedShapes(state: import("immer/dist/internal").WritableDraft<IPointDisplay>, action: PayloadAction<ICheckedMarks>): void;
    toggleShape(state: import("immer/dist/internal").WritableDraft<IPointDisplay>, action: PayloadAction<{
        key: string;
        value: boolean;
    }>): void;
}>;
export declare const PointDisplayReducer: import("redux").Reducer<IPointDisplay, import("redux").AnyAction>;
export {};
