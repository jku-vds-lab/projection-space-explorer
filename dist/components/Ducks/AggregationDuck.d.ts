import { AnyAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import type { RootState } from '../Store/Store';
export declare const selectVectors: (selection: number[], shiftKey?: boolean) => (dispatch: any, getState: any) => ThunkAction<any, RootState, unknown, AnyAction>;
export declare const selectClusters: (selection: (number | string)[], shiftKey?: boolean) => (dispatch: any, getState: any) => ThunkAction<any, RootState, unknown, AnyAction>;
declare const initialState: {
    aggregation: number[];
    selectedClusters: (string | number)[];
    source: "sample" | "cluster";
};
declare const currentAggregation: (state: {
    aggregation: number[];
    selectedClusters: (string | number)[];
    source: "sample" | "cluster";
}, action: any) => typeof initialState;
export default currentAggregation;
//# sourceMappingURL=AggregationDuck.d.ts.map