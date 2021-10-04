import { LinearColorScale } from "./LinearColorScale";
import { ContinuousMapping, DiscreteMapping } from "./Mapping";
export declare class ScaleUtil {
    static mapScale(scale: LinearColorScale, value: any): any;
    static mappingFromScale(scale: LinearColorScale, attribute: any, dataset: any): DiscreteMapping | ContinuousMapping;
}
export declare class ContinuosScale extends LinearColorScale {
    constructor(stops: any);
}
export declare class DiscreteScale extends LinearColorScale {
    constructor(stops: any);
}
