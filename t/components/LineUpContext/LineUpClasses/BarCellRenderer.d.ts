import { Column, ERenderMode, ICellRenderer, ICellRendererFactory, IGroupCellRenderer, IImposer, INumberColumn, IRenderContext, ISummaryRenderer } from "lineupjs";
export default class BarCellRenderer implements ICellRendererFactory {
    private readonly renderValue;
    readonly title: string;
    /**
     * flag to always render the value
     * @type {boolean}
     */
    constructor(renderValue?: boolean);
    canRender(col: Column, mode: ERenderMode): boolean;
    create(col: INumberColumn, context: IRenderContext, imposer?: IImposer): ICellRenderer;
    createGroup(): IGroupCellRenderer;
    createSummary(): ISummaryRenderer;
}
