/// <reference types="offscreencanvas" />
import { CubicBezierCurve } from '../../model/Curves';
import type { RootState } from './Store';
/**
 * Creates a partial dump which excludes a list of columns.
 */
export declare class UtilityActions {
    static partialDump(state: any, excluded: string[]): any;
    static bezierLength(curve: CubicBezierCurve): number;
    static solveCatmullRom(data: any, k: any): CubicBezierCurve[];
    static partialBezierCurve(t: number, curve: CubicBezierCurve): {
        x: number;
        y: number;
    };
    static generateImage(state: RootState, width: number, height: number, padding: number, options: any, ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): Promise<string>;
}
