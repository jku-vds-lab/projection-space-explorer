export declare const setSelectedLineBy: (lineBy: any) => {
    type: string;
    value: any;
};
export declare const setLineByOptions: (options: any) => {
    type: string;
    options: any;
};
export declare function selectedLineBy(state: {
    value: string;
    options: any[];
}, action: any): {
    options: any[];
    value: any;
} | {
    options: any;
    value: string;
};
export default selectedLineBy;
