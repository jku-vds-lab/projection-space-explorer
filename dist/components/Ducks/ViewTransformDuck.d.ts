import { Camera } from "three";
export declare const setViewTransform: (camera: any, width: any, height: any) => {
    type: string;
    camera: any;
    width: any;
    height: any;
};
export declare const invalidateTransform: () => {
    type: string;
};
declare type ViewTransformType = {
    camera: Camera;
    width: number;
    height: number;
};
export declare const viewTransform: (state: ViewTransformType, action: any) => ViewTransformType;
export {};
