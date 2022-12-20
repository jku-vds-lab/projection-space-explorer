export declare const setHoverWindowMode: (windowMode: any) => {
    type: string;
    windowMode: any;
};
export declare enum WindowMode {
    Embedded = 0,
    Extern = 1
}
type HoverSettingsType = {
    windowMode: WindowMode;
};
declare const hoverSettings: (state: HoverSettingsType, action: any) => {
    windowMode: any;
};
export default hoverSettings;
