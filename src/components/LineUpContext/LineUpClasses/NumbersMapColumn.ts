import {dialogAddons, INumbersDesc, SortByDefault, toolbar} from 'lineupjs';
import {IDataRow} from 'lineupjs';
import MapColumn, {IMapColumnDesc} from 'lineupjs';
import {isMissingValue} from 'lineupjs';
import { IEventListener } from 'lineupjs/build/src/internal';
import ValueColumn, { dataLoaded } from 'lineupjs/build/src/model/ValueColumn';
import Column, {widthChanged, labelChanged, metaDataChanged, dirty, dirtyHeader, dirtyValues, rendererTypeChanged, groupRendererChanged, summaryRendererChanged, visibilityChanged, dirtyCaches} from 'lineupjs/build/src/model/Column';

export declare type INumbersMapColumnDesc = INumbersDesc & IMapColumnDesc<number[]>;

/**
 * a numbersMap column with optional alignment
 */
@toolbar('rename', 'filterNumber', 'colorMapped', 'editMapping')
@dialogAddons('sort', 'sortNumbers')
@SortByDefault('descending')
//@ts-ignore
export default class NumbersMapColumn extends MapColumn<number[]> {
  readonly dataLength: number|null;

  constructor(id: string, desc: Readonly<INumbersMapColumnDesc>) {
    super(id, desc);
    this.dataLength = desc.dataLength;
  }

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

  getValue(row: IDataRow) {
    const r = this.getMapValue(row);
    return r.every((d) => d.value === '') ? null : r;
  }

  getMapValue(row: IDataRow) {
    return super.getMap(row).map(({key, value}) => ({
      key,
      value: isMissingValue(value) ? '' : String(value)
    }));
  }
}