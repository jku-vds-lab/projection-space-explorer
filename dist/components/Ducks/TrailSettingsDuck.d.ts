type TrailSettingsState = {
    length: number;
    show: boolean;
};
export default function trailSettings(state: TrailSettingsState, action: any): {
    show: boolean;
    length: any;
} | {
    show: any;
    length: number;
};
export declare function setTrailLength(length: number): {
    type: string;
    length: number;
};
export declare function setTrailVisibility(show: boolean): {
    type: string;
    show: boolean;
};
export {};
//# sourceMappingURL=TrailSettingsDuck.d.ts.map