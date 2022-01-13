import { SchemeColor } from ".";
import { ShallowSet } from "../ShallowSet";
import { BaseColorScale } from "../../Ducks/ColorScalesDuck";
export declare abstract class Mapping {
    scale: BaseColorScale;
    constructor(scale: any);
    abstract map(value: any): any;
}
export declare class DiscreteMapping extends Mapping {
    values: ShallowSet;
    constructor(scale: any, values: any);
    index(value: any): number;
    map(value: any): SchemeColor;
}
export declare class ContinuousMapping extends Mapping {
    range: any;
    constructor(scale: any, range: any);
    map(value: any): SchemeColor;
}
