import { colorOf, Column, DEFAULT_COLOR, ERenderMode, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, IImposer, INumberColumn, IRenderContext, isNumberColumn, isNumbersColumn, ISummaryRenderer, renderMissingCanvas, renderMissingDOM } from "lineupjs";
import { adaptDynamicColorToBgColor, noRenderer, setText, CANVAS_HEIGHT } from './utils'

// https://github.com/lineupjs/lineupjs/blob/master/src/renderer/BarCellRenderer.ts


export default class BarCellRenderer implements ICellRendererFactory {
  readonly title: string = 'Bar';

  /**
   * flag to always render the value
   * @type {boolean}
   */

  constructor(private readonly renderValue: boolean = false) {
  }

  canRender(col: Column, mode: ERenderMode): boolean {
    return mode === ERenderMode.CELL && isNumberColumn(col) && !isNumbersColumn(col);
  }

  create(col: INumberColumn, context: IRenderContext, imposer?: IImposer): ICellRenderer {
    const width = context.colWidth(col);
    return {
      template: `<div title="">
          <div class="lu-bar-label" style='background-color: ${DEFAULT_COLOR}'>
            <span ${this.renderValue ? '' : `class="lu-hover-only"`}></span>
          </div>
        </div>`,
      update: (n: HTMLDivElement, d: IDataRow) => {
        const value = col.getNumber(d);
        const missing = renderMissingDOM(n, col, d);
        const w = isNaN(value) ? 0 : Math.round(value * 10000)/100;
        const title = col.getLabel(d);
        n.title = title;

        const bar = <HTMLElement>n.firstElementChild!;
        bar.style.width = missing ? '100%' : `${w}%`;
        const color = colorOf(col, d, imposer, value);
        bar.style.backgroundColor = missing ? null : color;
        setText(bar.firstElementChild!, title);
        const item = <HTMLElement>bar.firstElementChild!;
        setText(item, title);
        item.style.color = 'black';
        // adaptDynamicColorToBgColor(item, color || DEFAULT_COLOR, title, w / 100);
      },
      render: (ctx: CanvasRenderingContext2D, d: IDataRow) => {
        if (renderMissingCanvas(ctx, col, d, width)) {
          return;
        }
        const value = col.getNumber(d);
        ctx.fillStyle = colorOf(col, d, imposer, value) || DEFAULT_COLOR;
        const w = width * value;
        ctx.fillRect(0, 0, isNaN(w) ? 0 : w, CANVAS_HEIGHT);

      }
    };
  }

  createGroup(): IGroupCellRenderer {
    return noRenderer;
  }

  createSummary(): ISummaryRenderer {
    return noRenderer;
  }
}