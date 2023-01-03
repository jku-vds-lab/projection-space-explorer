export declare enum DisplayMode {
    None = 0,
    OnlyStates = 1,
    OnlyClusters = 2,
    StatesAndClusters = 3
}
export declare function displayModeSupportsStates(displayMode: DisplayMode): boolean;
export declare function displayModeSuportsClusters(displayMode: DisplayMode): boolean;
export default function displayMode(state: DisplayMode, action: any): DisplayMode;
export declare const setDisplayMode: (displayMode: any) => {
    type: string;
    displayMode: any;
};
//# sourceMappingURL=DisplayModeDuck.d.ts.map