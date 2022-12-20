export interface GlobalLabelsState {
    itemLabel: string;
    itemLabelPlural: string;
}
export declare const setItemLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
    label_plural?: string;
}, "globalLabels/setItemLabel">;
export declare const globalLabels: import("redux").Reducer<GlobalLabelsState, import("redux").AnyAction>;
