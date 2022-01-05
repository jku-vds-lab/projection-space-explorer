import {hsl} from 'd3-color';

export const CANVAS_HEIGHT = 4;

/** @internal */
export function noop() {
  // no op
}

export const noRenderer = {
  template: `<div></div>`,
  update: <() => void>noop
};

/** @internal */
export function setText<T extends Node>(node: T, text?: string): T {
  if (text === undefined) {
    return node;
  }
  if (node.textContent !== text) {
    node.textContent = text;
  }
  return node;
}


// side effect
const adaptColorCache: {[bg: string]: string} = {};
/**
 * Adapts the text color for a given background color
 * @param {string} bgColor as `#ff0000`
 * @returns {string} returns `black` or `white` for best contrast
 */
export function adaptTextColorToBgColor(bgColor: string): string {
  const bak = adaptColorCache[bgColor];
  if (bak) {
    return bak;
  }
  return adaptColorCache[bgColor] = hsl(bgColor).l > 0.5 ? 'black' : 'white';
}


/**
 *
 * Adapts the text color for a given background color
 * @param {HTMLElement} node the node containing the text
 * @param {string} bgColor as `#ff0000`
 * @param {string} title the title to render
 * @param {number} width for which percentages of the cell this background applies (0..1)
 */
export function adaptDynamicColorToBgColor(node: HTMLElement, bgColor: string, title: string, width: number) {
  const adapt = adaptTextColorToBgColor(bgColor);
  if ((width <= 0.05 || adapt === 'black') || width > 0.9) { // almost empty or full
    node.style.color = adapt === 'black' || width <= 0.05 ? null : adapt; // null = black
    // node.classList.remove('lu-gradient-text');
    // node.style.backgroundImage = null;
    return;
  }

  node.style.color = null;
  node.innerText = title;

  const span = node.ownerDocument!.createElement('span');
  span.classList.add('lu-gradient-text');
  span.style.color = adapt;
  span.innerText = title;
  node.appendChild(span);
}
