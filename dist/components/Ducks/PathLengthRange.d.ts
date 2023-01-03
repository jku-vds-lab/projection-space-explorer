export declare const setPathLengthRange: (pathLengthRange: any) => {
    type: string;
    range: any;
};
export declare const setPathLengthMaximum: (pathLengthMaximum: any) => {
    type: string;
    maximum: any;
};
declare const pathLengthRange: (state: {
    range: number[];
    maximum: number;
}, action: any) => {
    range: any;
    maximum: number;
} | {
    range: number[];
    maximum: any;
};
export default pathLengthRange;
//# sourceMappingURL=PathLengthRange.d.ts.map