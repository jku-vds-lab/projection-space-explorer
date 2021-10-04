/**
 * Duck file for the LineUp input data
 */
export declare const setLineUpInput_visibility: (input: any) => {
    type: string;
    input: any;
};
export declare const setLineUpInput_dump: (input: any) => {
    type: string;
    input: any;
};
export declare const setLineUpInput_filter: (input: any) => {
    type: string;
    input: any;
};
export declare const updateLineUpInput_filter: (input: any) => {
    type: string;
    input: any;
};
export declare const setLineUpInput_lineup: (input: any) => {
    type: string;
    input: any;
};
export declare const setLineUpInput_update: (input: any) => {
    type: string;
    input: any;
};
export declare type LineUpType = {
    show: boolean;
    dump: string;
    filter: object;
    previousfilter: object;
    lineup: any;
    update: number;
};
declare const lineUpInput: (state: LineUpType, action: any) => LineUpType;
export default lineUpInput;
