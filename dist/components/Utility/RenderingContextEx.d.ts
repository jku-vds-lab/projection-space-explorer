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
}
