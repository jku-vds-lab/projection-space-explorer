/// <reference types="react" />
declare type ShowColorLegendProps = {
    mapping: any;
    advancedColoringSelection: boolean[];
    setAdvancedColoringSelection: Function;
};
export declare var AdvancedColoringLegendFull: ({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) => JSX.Element;
export declare const AdvancedColoringLegend: import("react-redux").ConnectedComponent<({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) => JSX.Element, Pick<ShowColorLegendProps, never>>;
export {};
