import { format } from "d3";
import { ArrayColumn, Column, dialogAddons, EAdvancedSortMethod, ECompareValueType, IAdvancedBoxPlotData, IColorMappingFunction, IDataRow, IKeyValue, IMapColumnDesc, IMappingFunction, INumberFilter, INumberMapColumnDesc, INumbersColumn, INumbersDesc, isUnknown, ITypeFactory, MapColumn, NumberColumn, NumbersColumn, ScaleMappingFunction, SortByDefault, toolbar, ValueColumn } from "lineupjs";
import { IBoxPlotData, IEventListener, IForEachAble } from "lineupjs/build/src/internal";
import { dirty, dirtyCaches, dirtyHeader, dirtyValues, groupRendererChanged, labelChanged, metaDataChanged, rendererTypeChanged, summaryRendererChanged, visibilityChanged, widthChanged } from "lineupjs/build/src/model/Column";
import { dataLoaded } from "lineupjs/build/src/model/ValueColumn";
import { DEFAULT_FORMATTER, isDummyNumberFilter, isEqualNumberFilter, noNumberFilter, restoreMapping, restoreNumberFilter } from "./helper_methods";


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


@toolbar('rename', 'filterNumber', 'sort', 'sortBy')
@dialogAddons('sort', 'sortNumbers')
@SortByDefault('descending')
export class TestColumn extends MapColumn<number[]>  {
    static readonly EVENT_MAPPING_CHANGED = NumberColumn.EVENT_MAPPING_CHANGED;
    static readonly EVENT_COLOR_MAPPING_CHANGED = NumberColumn.EVENT_COLOR_MAPPING_CHANGED;
    static readonly EVENT_SORTMETHOD_CHANGED = NumberColumn.EVENT_SORTMETHOD_CHANGED;
    static readonly EVENT_FILTER_CHANGED = NumberColumn.EVENT_FILTER_CHANGED;
  
    private readonly numberFormat: (n: number) => string = DEFAULT_FORMATTER;
  
    private sort: EAdvancedSortMethod;
    private mapping: IMappingFunction;
    private original: IMappingFunction;
    private colorMapping: IColorMappingFunction;
    /**
     * currently active filter
     * @type {{min: number, max: number}}
     * @private
     */
    private currentFilter: INumberFilter = noNumberFilter();

    private min: number = 0;
    private max: number = 1;
    
  
    constructor(id: string, desc: Readonly<ITestColumnDesc>, factory: ITypeFactory) {
      super(id, desc);
      // this.mapping = restoreMapping(desc, factory); // TODO: check, if desc.range and desc.domain can be infered
      this.mapping = new ScaleMappingFunction([desc["min"], desc["max"]], 'linear', [0, 1]);
      this.original = this.mapping.clone();
      this.sort = desc.sort || EAdvancedSortMethod.median;
      this.colorMapping = factory.colorMappingFunction(desc.colorMapping || desc.color);
  
      if (desc.numberFormat) {
        this.numberFormat = format(desc.numberFormat);
      }

      //TODO: infer min and max if it is not given
      this.min = desc["min"];
      this.max = desc["max"];
    }

    getMin(){
        return this.min;
    }

    getMax(){
        return this.max;
    }
  
    getNumberFormat() {
        return this.numberFormat;
    }

    // https://stackoverflow.com/questions/45309447/calculating-median-javascript
    private get_quartile(values, q=0.5){ // 1. quartile: q=0.25 | median: q=0.5 | 3. quartile: q=0.75
        if(values.length === 0) return 0;
      
        values.sort(function(a,b){
          return a-b;
        });
      
        var half = Math.floor(values.length * q);
      
        if (values.length % 2)
          return values[half];
      
        return (values[half - 1] + values[half]) / 2.0;
    }

    // https://www.sitepoint.com/community/t/calculating-the-average-mean/7302/2
    private mean(numbers) {
        var total = 0,
            i;
        for (i = 0; i < numbers.length; i += 1) {
            total += numbers[i];
        }
        return total / numbers.length;
    }

    private get_advanced_value(method:EAdvancedSortMethod, value_list: number[]): number {
        switch(method){
            case EAdvancedSortMethod.min:
                return Math.min(...value_list);
            case EAdvancedSortMethod.max: 
                return Math.max(...value_list);
            case EAdvancedSortMethod.mean:
                return this.mean(value_list);
            case EAdvancedSortMethod.median:
                return this.get_quartile(value_list);
            case EAdvancedSortMethod.q1: 
                return this.get_quartile(value_list, 1);
            case EAdvancedSortMethod.q3: 
                return this.get_quartile(value_list, 3);
            default:
                return this.get_quartile(value_list);
        }
    }

    toCompareValue(row: IDataRow): number {
        let data = this.getValue(row);
        let value_list = data[0]["value"];
        const method = this.getSortMethod();
        return this.get_advanced_value(method, value_list);
    }
  
    toCompareValueType() {
        return ECompareValueType.FLOAT;
    }

    private getBoxPlotDataFromValueList(data: number[]): IAdvancedBoxPlotData | null {

      return {
        "mean": this.get_advanced_value(EAdvancedSortMethod.mean, data), 
        "missing": 0, 
        "count": data.length, 
        "max": this.get_advanced_value(EAdvancedSortMethod.max, data), 
        "min": this.get_advanced_value(EAdvancedSortMethod.min, data), 
        "median": this.get_advanced_value(EAdvancedSortMethod.median, data), 
        "q1": this.get_advanced_value(EAdvancedSortMethod.q1, data), 
        "q3": this.get_advanced_value(EAdvancedSortMethod.q3, data)
    };
    }

    getBoxPlotData(row: IDataRow): IAdvancedBoxPlotData | null {
      console.log("getBoxPlotData");
        const data = this.getValue(row)[0]["value"];
        if (data == null) {
            return null;
        }
        return this.getBoxPlotDataFromValueList(data);
    }
    
    getRawBoxPlotData(row: IDataRow): IAdvancedBoxPlotData | null {
      console.log("getRawBoxPlotData");
        const data = this.getRawValue(row)[0]["value"];
        if (data == null) {
            return null;
        }
        return this.getBoxPlotDataFromValueList(data);
    }
  
    getRange() {
      console.log("getRange")
        return this.mapping.getRange(this.numberFormat);
    }

    getColorMapping() {
      console.log("getColorMapping")
        return this.colorMapping.clone();
    }
  
  
    getNumber(row: IDataRow): number {
      // console.log("getNumber")
      return this.mapping.apply(this.toCompareValue(row));
    }
  
    getRawNumber(row: IDataRow): number {
      // console.log("getRawNumber")
      return this.toCompareValue(row);
    }
  
    iterNumber(row: IDataRow) {
      // console.log("iterNumber")
      const r = this.getValue(row);
      // return r ? r.map((d) => d.value) : [NaN];
      // return r ? r[0]["value"] : [NaN];
      return [this.get_advanced_value(EAdvancedSortMethod.median, r[0]["value"])]
    }
  
    iterRawNumber(row: IDataRow) {
      // console.log("iterRawNumber")
      const r = this.getRawValue(row);
      // return r ? r.map((d) => d.value) : [NaN];
      // return r ? r[0]["value"] : [NaN];
      return [this.get_advanced_value(EAdvancedSortMethod.median, r[0]["value"])]
    }
  
    getValue(row: IDataRow): IKeyValue<number[]>[] {
        const values = this.getRawValue(row);
      
        if(values.length === 0)
            return null;

        return values.map(({key, value}) => {
            return {key, value: value.length===0 ? null : value.map(val => this.mapping.apply(val))};
        });
    }
  
    getRawValue(row: IDataRow): IKeyValue<number[]>[] {
        const r = super.getValue(row);
        return r == null ? [] : r;
        // const values = super.getValue(row);
      
        // if(values.length === 0)
        //     return null;

        // return values.map(({key, value}) => {
        //     return {key, value: value.length===0 ? null : value};
        // });
    }
  
    getExportValue(row: IDataRow, format: 'text' | 'json'): any {
      return format === 'json' ? this.getRawValue(row) : super.getExportValue(row, format);
    }
  
    getLabels(row: IDataRow) {
      const v = this.getRawValue(row);
      
      return Object.keys(v)
        .map((key) => ({ key, value: v[key].map(val => this.numberFormat(val) ) }));
    }
  
    getSortMethod() {
      return this.sort;
    }
  
    setSortMethod(sort: EAdvancedSortMethod) {
      if (this.sort === sort) {
        return;
      }
      this.fire([TestColumn.EVENT_SORTMETHOD_CHANGED], this.sort, this.sort = sort);
      // sort by me if not already sorted by me
      if (!this.isSortedByMe().asc) {
        this.sortByMe();
      }
    }
  
    dump(toDescRef: (desc: any) => any): any {
      const r = super.dump(toDescRef);
      r.sortMethod = this.getSortMethod();
      r.filter = !isDummyNumberFilter(this.currentFilter) ? this.currentFilter : null;
      r.map = this.mapping.toJSON();
      return r;
    }
  
    restore(dump: any, factory: ITypeFactory) {
      super.restore(dump, factory);
      if (dump.sortMethod) {
        this.sort = dump.sortMethod;
      }
      if (dump.filter) {
        this.currentFilter = restoreNumberFilter(dump.filter);
      }
      if (dump.map || dump.domain) {
        this.mapping = restoreMapping(dump, factory);
      }
    }
  
    protected createEventList() {
      return super.createEventList().concat([TestColumn.EVENT_MAPPING_CHANGED, TestColumn.EVENT_SORTMETHOD_CHANGED, TestColumn.EVENT_FILTER_CHANGED]);
    }
  
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
    on(type: string | string[], listener: IEventListener | null): this; // required for correct typings in *.d.ts
    on(type: string | string[], listener: IEventListener | null): this {
      return super.on(<any>type, listener);
    }
  
    getOriginalMapping() {
      return this.original.clone();
    }
  
    getMapping() {
      return this.mapping.clone();
    }
  
    setMapping(mapping: IMappingFunction) {
      if (this.mapping.eq(mapping)) {
        return;
      }
      this.fire([TestColumn.EVENT_MAPPING_CHANGED, Column.EVENT_DIRTY_VALUES, Column.EVENT_DIRTY], this.mapping.clone(), this.mapping = mapping);
    }
  
    getColor(row: IDataRow) {
      return NumberColumn.prototype.getColor.call(this, row);
    }
  
    isFiltered() {
      return NumberColumn.prototype.isFiltered.call(this);
    }
  
    getFilter(): INumberFilter {
      return NumberColumn.prototype.getFilter.call(this);
    }
  
    setFilter(value: INumberFilter | null) {
      NumberColumn.prototype.setFilter.call(this, value);
    }
  
    // filter(row: IDataRow) {
    //   return NumberColumn.prototype.filter.call(this, row);
    // }


    /** @internal */
    private isNumberIncluded(filter: INumberFilter | null, value: number) {
      if (!filter) {
        return true;
      }
      if (Number.isNaN(value)) {
        return !filter.filterMissing;
      }
      return !((isFinite(filter.min) && value < filter.min) || (isFinite(filter.max) && value > filter.max));
    }

    /**
     * filter the current row if any filter is set
     * @param row
     * @returns {boolean}
     */
    // TODO: customize filter: max, min, median...
    filter(row: IDataRow) { // currently it checks, if the median is within the range
      // const value = this.getRawNumber(row);
      const value = this.get_advanced_value(EAdvancedSortMethod.median, this.getRawValue(row)[0]["value"]);

      return this.isNumberIncluded(this.getFilter(), value);
    }
    
    clearFilter() {
      return NumberColumn.prototype.clearFilter.call(this);
    }
}