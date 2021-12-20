import { Column, EAdvancedSortMethod, ECompareValueType, IAdvancedBoxPlotData, IColorMappingFunction, IDataRow, IKeyValue, IMapColumnDesc, IMappingFunction, INumberFilter, INumbersDesc, ITypeFactory, MapColumn, ValueColumn } from "lineupjs";
import { IEventListener } from "lineupjs/build/src/internal";
import { dirty, dirtyCaches, dirtyHeader, dirtyValues, groupRendererChanged, labelChanged, metaDataChanged, rendererTypeChanged, summaryRendererChanged, visibilityChanged, widthChanged } from "lineupjs/build/src/model/Column";
import { dataLoaded } from "lineupjs/build/src/model/ValueColumn";
/**
 * emitted when the mapping property changes
 * @asMemberOf NumberMapColumn
 * @event
 */
export declare function mappingChanged_NMC(previous: IMappingFunction, current: IMappingFunction): void;
/**
 * emitted when the color mapping property changes
 * @asMemberOf NumberMapColumn
 * @event
 */
export declare function colorMappingChanged_NMC(previous: IColorMappingFunction, current: IColorMappingFunction): void;
/**
 * emitted when the sort method property changes
 * @asMemberOf NumberMapColumn
 * @event
 */
export declare function sortMethodChanged_NMC(previous: EAdvancedSortMethod, current: EAdvancedSortMethod): void;
/**
 * emitted when the filter property changes
 * @asMemberOf NumberMapColumn
 * @event
 */
export declare function filterChanged_NMC(previous: INumberFilter | null, current: INumberFilter | null): void;
export declare type ITestColumnDesc = INumbersDesc & IMapColumnDesc<number[]>;
export declare class TestColumn extends MapColumn<number[]> {
    static readonly EVENT_MAPPING_CHANGED = "mappingChanged";
    static readonly EVENT_COLOR_MAPPING_CHANGED = "colorMappingChanged";
    static readonly EVENT_SORTMETHOD_CHANGED = "sortMethodChanged";
    static readonly EVENT_FILTER_CHANGED = "filterChanged";
    private readonly numberFormat;
    private sort;
    private mapping;
    private original;
    private colorMapping;
    /**
     * currently active filter
     * @type {{min: number, max: number}}
     * @private
     */
    private currentFilter;
    private min;
    private max;
    constructor(id: string, desc: Readonly<ITestColumnDesc>, factory: ITypeFactory);
    getMin(): number;
    getMax(): number;
    getNumberFormat(): (n: number) => string;
    private get_quartile;
    private mean;
    private get_advanced_value;
    toCompareValue(row: IDataRow): number;
    toCompareValueType(): ECompareValueType;
    private getBoxPlotDataFromValueList;
    getBoxPlotData(row: IDataRow): IAdvancedBoxPlotData | null;
    getRawBoxPlotData(row: IDataRow): IAdvancedBoxPlotData | null;
    getRange(): [string, string];
    getColorMapping(): IColorMappingFunction;
    getNumber(row: IDataRow): number;
    getRawNumber(row: IDataRow): number;
    iterNumber(row: IDataRow): number[];
    iterRawNumber(row: IDataRow): number[];
    getValue(row: IDataRow): IKeyValue<number[]>[];
    getRawValue(row: IDataRow): IKeyValue<number[]>[];
    getExportValue(row: IDataRow, format: 'text' | 'json'): any;
    getLabels(row: IDataRow): {
        key: string;
        value: any;
    }[];
    getSortMethod(): EAdvancedSortMethod;
    setSortMethod(sort: EAdvancedSortMethod): void;
    dump(toDescRef: (desc: any) => any): any;
    restore(dump: any, factory: ITypeFactory): void;
    protected createEventList(): string[];
    on(type: typeof TestColumn.EVENT_MAPPING_CHANGED, listener: typeof mappingChanged_NMC | null): this;
    on(type: typeof TestColumn.EVENT_SORTMETHOD_CHANGED, listener: typeof sortMethodChanged_NMC | null): this;
    on(type: typeof TestColumn.EVENT_FILTER_CHANGED, listener: typeof filterChanged_NMC | null): this;
    on(type: typeof ValueColumn.EVENT_DATA_LOADED, listener: typeof dataLoaded | null): this;
    on(type: typeof Column.EVENT_WIDTH_CHANGED, listener: typeof widthChanged | null): this;
    on(type: typeof Column.EVENT_LABEL_CHANGED, listener: typeof labelChanged | null): this;
    on(type: typeof Column.EVENT_METADATA_CHANGED, listener: typeof metaDataChanged | null): this;
    on(type: typeof Column.EVENT_DIRTY, listener: typeof dirty | null): this;
    on(type: typeof Column.EVENT_DIRTY_HEADER, listener: typeof dirtyHeader | null): this;
    on(type: typeof Column.EVENT_DIRTY_VALUES, listener: typeof dirtyValues | null): this;
    on(type: typeof Column.EVENT_DIRTY_CACHES, listener: typeof dirtyCaches | null): this;
    on(type: typeof Column.EVENT_RENDERER_TYPE_CHANGED, listener: typeof rendererTypeChanged | null): this;
    on(type: typeof Column.EVENT_GROUP_RENDERER_TYPE_CHANGED, listener: typeof groupRendererChanged | null): this;
    on(type: typeof Column.EVENT_SUMMARY_RENDERER_TYPE_CHANGED, listener: typeof summaryRendererChanged | null): this;
    on(type: typeof Column.EVENT_VISIBILITY_CHANGED, listener: typeof visibilityChanged | null): this;
    on(type: string | string[], listener: IEventListener | null): this;
    getOriginalMapping(): IMappingFunction;
    getMapping(): IMappingFunction;
    setMapping(mapping: IMappingFunction): void;
    getColor(row: IDataRow): any;
    isFiltered(): any;
    getFilter(): INumberFilter;
    setFilter(value: INumberFilter | null): void;
    /** @internal */
    private isNumberIncluded;
    /**
     * filter the current row if any filter is set
     * @param row
     * @returns {boolean}
     */
    filter(row: IDataRow): boolean;
    clearFilter(): any;
}
