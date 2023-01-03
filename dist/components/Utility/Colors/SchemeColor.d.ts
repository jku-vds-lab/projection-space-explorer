export declare class SchemeColor {
    hex: string;
    rgb: {
        r: any;
        g: any;
        b: any;
    };
    constructor(hex: any);
    hexToRgb(hex: any): {
        r: number;
        g: number;
        b: number;
    };
    static componentToHex(c: any): any;
    static rgbToHex(r: any, g: any, b: any): SchemeColor;
}
//# sourceMappingURL=SchemeColor.d.ts.map