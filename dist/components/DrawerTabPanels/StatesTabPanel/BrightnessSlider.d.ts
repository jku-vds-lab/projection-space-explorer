declare function BrightnessSliderFull({ globalPointBrightness, setRange }: {
    globalPointBrightness: any;
    setRange: any;
}): JSX.Element;
export declare const BrightnessSlider: import("react-redux").ConnectedComponent<typeof BrightnessSliderFull, Pick<{
    globalPointBrightness: any;
    setRange: any;
}, "globalPointBrightness">>;
export {};
