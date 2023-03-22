export declare const setViewTransform: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    camera: any;
    width: any;
    height: any;
    multipleId: any;
}, string>;
export declare const setD3Transform: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    x: any;
    y: any;
    k: any;
}, string>;
/**
 * Type specifying the camera transformation that all components should use.
 * From this an orthographic projection can be constructed.
 */
export type ViewTransformType = {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    zoom: number;
    x: number;
    y: number;
    k: number;
};
export declare const viewTransform: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<ViewTransformType>;
//# sourceMappingURL=ViewTransformDuck.d.ts.map