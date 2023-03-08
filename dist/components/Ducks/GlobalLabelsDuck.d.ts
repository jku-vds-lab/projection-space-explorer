export interface GlobalLabelsState {
    itemLabel: string;
    itemLabelPlural: string;
    storyLabel: string;
    storyLabelPlural: string;
    storyBookLabel: string;
    storyBookLabelPlural: string;
    storyTellingLabel: string;
}
export declare const setItemLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
    labelPlural?: string;
}, "globalLabels/setItemLabel">, setStoryLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
    labelPlural?: string;
}, "globalLabels/setStoryLabel">, setStoryBookLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
    labelPlural?: string;
}, "globalLabels/setStoryBookLabel">, setStoryTellingLabel: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    label: string;
}, "globalLabels/setStoryTellingLabel">;
export declare const globalLabels: import("redux").Reducer<GlobalLabelsState, import("redux").AnyAction>;
//# sourceMappingURL=GlobalLabelsDuck.d.ts.map