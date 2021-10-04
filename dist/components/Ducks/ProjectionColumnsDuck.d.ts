declare const projectionColumns: (state: any[], action: any) => any;
export declare const setProjectionColumns: (projectionColumns: any) => {
    type: string;
    projectionColumns: any;
};
export declare const setProjectionColumnsEntry: (index: any, value: any) => {
    type: string;
    index: any;
    value: any;
};
export declare const setProjectionColumnsShift: (last: any, index: any) => {
    type: string;
    last: any;
    index: any;
};
export default projectionColumns;
