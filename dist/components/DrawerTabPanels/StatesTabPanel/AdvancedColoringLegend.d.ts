declare type ShowColorLegendProps = {
    pointColorMapping: any;
    advancedColoringSelection: boolean[];
    setAdvancedColoringSelection: Function;
};
export declare function AdvancedColoringLegendFull({ pointColorMapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps): JSX.Element;
export declare const AdvancedColoringLegend: import("react-redux").ConnectedComponent<typeof AdvancedColoringLegendFull, Pick<ShowColorLegendProps, "pointColorMapping">>;
export {};
