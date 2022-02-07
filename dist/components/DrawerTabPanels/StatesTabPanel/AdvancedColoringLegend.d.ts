declare type ShowColorLegendProps = {
    mapping: any;
    advancedColoringSelection: boolean[];
    setAdvancedColoringSelection: Function;
};
export declare function AdvancedColoringLegendFull({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps): JSX.Element;
export declare const AdvancedColoringLegend: import("react-redux").ConnectedComponent<typeof AdvancedColoringLegendFull, Pick<ShowColorLegendProps, never>>;
export {};
