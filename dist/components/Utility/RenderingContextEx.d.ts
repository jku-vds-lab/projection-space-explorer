/**
 * Advanced RenderingContext that takes into account a specific pixel ratio.
 */
export declare class RenderingContextEx {
    context: CanvasRenderingContext2D;
    pixelRatio: number;
    constructor(context: any, pixelRatio: any);
    set lineWidth(value: any);
    set lineDashOffset(value: any);
    set strokeStyle(value: any);
    set lineCap(value: any);
    setLineDash(value: any): void;
    beginPath(): void;
    closePath(): void;
    arc(x: any, y: any, radius: any, startAngle: any, endAngle: any, anticlockwise: any): void;
    lineTo(x: any, y: any): void;
    arrowTo(fromX: any, fromY: any, toX: any, toY: any, headlen?: number): void;
    stroke(): void;
    moveTo(x: any, y: any): void;
    /*!	Curve function for canvas 2.3.1
 *	Epistemex (c) 2013-2014
 *	License: MIT
 */
    /**
     * Draws a cardinal spline through given point array. Points must be arranged
     * as: [x1, y1, x2, y2, ..., xn, yn]. It adds the points to the current path.
     *
     * The method continues previous path of the context. If you don't want that
     * then you need to use moveTo() with the first point from the input array.
     *
     * The points for the cardinal spline are returned as a new array.
     *
     * @param {CanvasRenderingContext2D} ctx - context to use
     * @param {Array} points - point array
     * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
     * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
     * @param {Boolean} [close=false] - Close the ends making the line continuous
     * @returns {Float32Array} New array with the calculated points that was added to the path
     */
    curve(ctx: any, points: any, tension: any, numOfSeg: any, close: any): Float32Array;
}
