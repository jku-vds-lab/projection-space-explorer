import { RenderingContextEx } from "../../Utility/RenderingContextEx";
/**
 * Base class for tools like the lasso selection, cluster dragging, trace selecting etc.
 */
export interface Tool {
    renderToContext(context: RenderingContextEx, start: any, end: any): void;
}
