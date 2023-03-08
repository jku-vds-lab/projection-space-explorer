export interface ProjectionColumn {
    name: string;
    checked: boolean;
    normalized: boolean;
    range: string;
    featureLabel: string;
    weight: number;
}
export declare const setProjectionColumnsAction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ProjectionColumn[], string>;
export declare const projectionColumns: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<ProjectionColumn[]>;
export default projectionColumns;
//# sourceMappingURL=ProjectionColumnsDuck.d.ts.map