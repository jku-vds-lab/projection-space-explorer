export interface ProjectionColumn {
    name: string;
    checked: boolean;
    normalized: boolean;
    range: string;
    featureLabel: string;
}
export declare const setProjectionColumnsAction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<ProjectionColumn[], string>;
export declare const projectionColumns: import("redux").Reducer<ProjectionColumn[], import("redux").AnyAction>;
export default projectionColumns;
