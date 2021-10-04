import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../Store/Store";
export declare const selectVectors: (selection: number[], shiftKey?: boolean) => (dispatch: any, getState: any) => ThunkAction<any, RootState, unknown, AnyAction>;
export declare const selectClusters: (selection: string[], shiftKey?: boolean) => (dispatch: any, getState: any) => ThunkAction<any, RootState, unknown, AnyAction>;
declare const initialState: {
    aggregation: number[];
    selectedClusters: string[];
    source: "sample" | "cluster";
};
declare const currentAggregation: (state: {
    aggregation: number[];
    selectedClusters: string[];
    source: "sample" | "cluster";
}, action: any) => typeof initialState;
export default currentAggregation;
