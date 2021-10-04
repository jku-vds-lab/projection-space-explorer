/**
 * Custom set implementation that can handle array types as well
 */
export declare class ShallowSet {
    values: any[];
    constructor(values: any);
    has(value: any): any;
    add(value: any): void;
    get(index: number): any;
    indexOf(value: any): number;
    map(callbackfn: any): unknown[];
    filter(callbackfn: any): any[];
}
