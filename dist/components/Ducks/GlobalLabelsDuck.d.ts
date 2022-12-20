export interface GlobalLabelsState {
    itemLabel: string;
    itemLabelPlural: string;
}
export declare const setItemLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
    label_plural?: string;
}, string>;
export declare const globalLabels: import("redux").Reducer<GlobalLabelsState, import("redux").AnyAction>;
