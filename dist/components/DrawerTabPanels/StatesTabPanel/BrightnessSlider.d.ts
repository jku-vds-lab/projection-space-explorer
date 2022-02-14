declare function BrightnessSliderFull({ brightnessScale, setRange }: {
    brightnessScale: any;
    setRange: any;
}): JSX.Element;
export declare const BrightnessSlider: import("react-redux").ConnectedComponent<typeof BrightnessSliderFull, Pick<{
    brightnessScale: any;
    setRange: any;
}, never>>;
export {};
