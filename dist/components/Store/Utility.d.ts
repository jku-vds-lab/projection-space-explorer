/**
 * Creates a partial dump which excludes a list of columns.
 */
export declare class UtilityActions {
    static partialDump(state: any, excluded: string[]): any;
    static generateImage(state: any, width: number, height: number, padding: number, options: any, ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): Promise<string>;
}
