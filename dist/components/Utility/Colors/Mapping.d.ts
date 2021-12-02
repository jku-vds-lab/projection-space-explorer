import { SchemeColor } from ".";
import { ShallowSet } from "../ShallowSet";
export declare abstract class Mapping {
    scale: any;
    constructor(scale: any);
    abstract map(value: any): any;
}
export declare class DiscreteMapping extends Mapping {
    values: ShallowSet;
    constructor(scale: any, values: any);
    index(value: any): number;
    map(value: any): any;
}
export declare class ContinuousMapping extends Mapping {
    range: any;
    constructor(scale: any, range: any);
    map(value: any): SchemeColor;
}
