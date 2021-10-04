export declare const setCheckedShapesAction: (checkedShapes: any) => {
    type: string;
    checkedShapes: any;
};
export declare const checkedShapes: (state: {
    star: boolean;
    cross: boolean;
    circle: boolean;
    square: boolean;
}, action: any) => any;
export default checkedShapes;
