export declare const SizeSliderMarks: {
    value: number;
    label: string;
}[];
declare function SizeSliderFull({ sizeScale, setRange }: {
    sizeScale: any;
    setRange: any;
}): JSX.Element;
export declare const SizeSlider: import("react-redux").ConnectedComponent<typeof SizeSliderFull, Pick<{
    sizeScale: any;
    setRange: any;
}, never>>;
export {};
