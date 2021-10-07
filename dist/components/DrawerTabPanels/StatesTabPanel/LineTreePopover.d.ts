import * as React from "react";
declare type LineSelectionTreeProps = {
    algorithms: any;
    onSelectAll: any;
    onChange: any;
    checkboxes: any;
    colorScale: any;
};
export declare function LineSelectionTree_GetChecks(algorithms: any): {};
export declare function LineSelectionTree_GenAlgos(vectors: any): {};
export declare var LineSelectionTree: React.ComponentType<Pick<LineSelectionTreeProps, "onChange" | "algorithms" | "onSelectAll" | "checkboxes" | "colorScale"> & import("@material-ui/core").StyledComponentProps<"root">>;
export declare var LineTreePopover: ({ webGlView, dataset, colorScale }: {
    webGlView: any;
    dataset: any;
    colorScale: any;
}) => JSX.Element;
export {};
