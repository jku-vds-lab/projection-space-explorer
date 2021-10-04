export declare const CANVAS_HEIGHT = 4;
/** @internal */
export declare function noop(): void;
export declare const noRenderer: {
    template: string;
    update: () => void;
};
/** @internal */
export declare function setText<T extends Node>(node: T, text?: string): T;
/**
 * Adapts the text color for a given background color
 * @param {string} bgColor as `#ff0000`
 * @returns {string} returns `black` or `white` for best contrast
 */
export declare function adaptTextColorToBgColor(bgColor: string): string;
/**
 *
 * Adapts the text color for a given background color
 * @param {HTMLElement} node the node containing the text
 * @param {string} bgColor as `#ff0000`
 * @param {string} title the title to render
 * @param {number} width for which percentages of the cell this background applies (0..1)
 */
export declare function adaptDynamicColorToBgColor(node: HTMLElement, bgColor: string, title: string, width: number): void;
