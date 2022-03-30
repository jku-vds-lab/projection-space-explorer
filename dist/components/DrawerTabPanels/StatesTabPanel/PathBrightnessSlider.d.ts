declare function PathBrightnessSliderFull({ lineBrightness, setLineBrightness }: {
    lineBrightness: any;
    setLineBrightness: any;
}): JSX.Element;
export declare const PathBrightnessSlider: import("react-redux").ConnectedComponent<typeof PathBrightnessSliderFull, Pick<{
    lineBrightness: any;
    setLineBrightness: any;
}, "lineBrightness">>;
export {};
