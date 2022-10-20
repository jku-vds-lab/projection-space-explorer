import { SchemeColor } from './SchemeColor';
import { ShallowSet } from '../ShallowSet';
import { BaseColorScale } from '../../../model/Palette';
export declare class DiscreteMapping {
    scale: BaseColorScale;
    values: ShallowSet;
    type: 'categorical';
}
export interface ContinuousMapping {
    scale: BaseColorScale;
    type: 'sequential';
    range: {
        min: number;
        max: number;
    };
}
export interface DivergingMapping {
    scale: BaseColorScale;
    range: [number, number, number];
    type: 'diverging';
}
export declare function mapValueToColor(mapping: ContinuousMapping | DivergingMapping | DiscreteMapping, value: any): SchemeColor;
export declare type Mapping = DiscreteMapping | DivergingMapping | ContinuousMapping;
