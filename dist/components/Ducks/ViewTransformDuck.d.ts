export declare const setViewTransform: (camera: any, width: any, height: any, multipleId: any) => {
    type: string;
    camera: any;
    width: any;
    height: any;
    multipleId: any;
};
export declare const invalidateTransform: () => {
    type: string;
};
/**
 * Type specifying the camera transformation that all components should use.
 * From this an orthographic projection can be constructed.
 */
export declare type ViewTransformType = {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    zoom: number;
};
export declare const viewTransform: (state: ViewTransformType, action: any) => ViewTransformType;
