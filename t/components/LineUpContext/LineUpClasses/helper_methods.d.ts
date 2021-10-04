import { IMapAbleDesc, IMappingFunction, INumberFilter, ITypeFactory } from "lineupjs";
export declare const DEFAULT_FORMATTER: (n: number | {
    valueOf(): number;
}) => string;
export declare function noNumberFilter(): {
    min: number;
    max: number;
    filterMissing: boolean;
};
export declare function isEqualNumberFilter(a: INumberFilter, b: INumberFilter, delta?: number): boolean;
export declare function similar(a: number, b: number, delta?: number): boolean;
export declare function isUnknown(v?: number | null): boolean;
export declare function isDummyNumberFilter(filter: INumberFilter): boolean;
export declare function restoreMapping(desc: IMapAbleDesc, factory: ITypeFactory): IMappingFunction;
export declare function restoreNumberFilter(v: INumberFilter): INumberFilter;
