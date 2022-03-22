export declare const SizeSliderMarks: {
    value: number;
    label: string;
}[];
declare function SizeSliderFull({ globalPointSize, setRange }: {
    globalPointSize: any;
    setRange: any;
}): JSX.Element;
export declare const SizeSlider: import("react-redux").ConnectedComponent<typeof SizeSliderFull, Pick<{
    globalPointSize: any;
    setRange: any;
}, "globalPointSize">>;
export {};
