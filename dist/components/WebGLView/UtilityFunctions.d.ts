import { Dataset, IBaseProjection } from '../../model';
import { IVector } from '../../model/Vector';
/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
export declare function getDefaultZoom(dataset: Dataset, width: any, height: any, xChannel: string, yChannel: string, workspace: IBaseProjection): {
    zoom: number;
    x: number;
    y: number;
};
export declare function interpolateLinear(min: any, max: any, k: any): any;
export declare function centerOfMass(points: any): {
    x: number;
    y: number;
};
export declare function arraysEqual(a: any, b: any): boolean;
/**
 * Checks if 2 dictionaries are equal
 * @param {*} a
 * @param {*} b
 */
export declare function dictEqual(a: any, b: any): boolean;
export declare function normalizeWheel(/* object */ event: any): {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
};
export declare function valueInRange(value: any, range: any): boolean;
export declare function replaceClusterLabels(vectors: IVector[], from: any, to: any): void;
export declare function getMinMaxOfChannel(dataset: Dataset, key: string, segment?: any): {
    min: any;
    max: any;
};
