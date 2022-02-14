import { CubicBezierCurve } from '../../model/Curves';
/**
 * Creates a partial dump which excludes a list of columns.
 */
export declare class UtilityActions {
    static partialDump(state: any, excluded: string[]): any;
    static solveCatmullRom(data: any, k: any): CubicBezierCurve[];
    static partialBezierCurve(t: any, p0: any, p1: any, p2: any, p3: any): {
        x: any;
        y: any;
    };
    static generateImage(state: any, width: number, height: number, padding: number, options: any, ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): Promise<string>;
}
