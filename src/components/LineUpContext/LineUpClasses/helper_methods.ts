import { format } from "d3";
import { IKeyValue, IMapAbleDesc, IMappingFunction, INumberFilter, ITypeFactory, ScaleMappingFunction } from "lineupjs";

export const DEFAULT_FORMATTER = format('.3n');

export function noNumberFilter() {
    return ({min: -Infinity, max: Infinity, filterMissing: false});
}

export function isEqualNumberFilter(a: INumberFilter, b: INumberFilter, delta = 0.001) {
    return similar(a.min, b.min, delta) && similar(a.max, b.max, delta) && a.filterMissing === b.filterMissing;
}
export function similar(a: number, b: number, delta = 0.5) {
    if (a === b) {
      return true;
    }
    return Math.abs(a - b) < delta;
}
export function isUnknown(v?: number | null) {
    return v == null || v === undefined || isNaN(v);
}

export function isDummyNumberFilter(filter: INumberFilter) {
    return !filter.filterMissing && !isFinite(filter.min) && !isFinite(filter.max);
}

export function restoreMapping(desc: IMapAbleDesc, factory: ITypeFactory): IMappingFunction {
    if (desc.map) {
      return factory.mappingFunction(desc.map);
    }
    return new ScaleMappingFunction(desc.domain || [0, 1], 'linear', desc.range || [0, 1]);
}

export function restoreNumberFilter(v: INumberFilter): INumberFilter {
    return {
      min: v.min != null && isFinite(v.min) ? v.min : -Infinity,
      max: v.max != null && isFinite(v.max) ? v.max : +Infinity,
      filterMissing: v.filterMissing
    };
  }