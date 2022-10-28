import { SchemeColor } from './SchemeColor';
import { ShallowSet } from '../ShallowSet';
import { BaseColorScale } from '../../../model/Palette';
import { Dataset } from '../../../model/Dataset';
export interface DiscreteMapping {
    scale: BaseColorScale;
    values: ShallowSet;
    type: 'categorical';
}
export interface ContinuousMapping {
    scale: BaseColorScale;
    type: 'sequential';
    range: [number, number];
}
export interface DivergingMapping {
    scale: BaseColorScale;
    range: [number, number, number];
    type: 'diverging';
}
/**
 * Helper function that maps a value to a color using a mapping
 *
 * @param mapping a mapping object
 * @param value any value
 * @returns a color
 */
export declare function mapValueToColor(mapping: ContinuousMapping | DivergingMapping | DiscreteMapping, value: any): SchemeColor;
/**
 * Helper type that contains a union over all mappings
 */
export declare type Mapping = DiscreteMapping | DivergingMapping | ContinuousMapping;
/**
 *
 * @param scale the color scale
 * @param key the key for the data values
 * @param dataset the dataset
 * @returns a mapping object
 */
export declare const mappingFromScale: (scale: BaseColorScale, key: string, dataset: Dataset) => DiscreteMapping | DivergingMapping | ContinuousMapping;
/**
 *
 * @param mapping a mapping object
 * @returns true if the given value is a numeric one
 */
export declare function isNumericMapping(mapping: Mapping): mapping is DivergingMapping | ContinuousMapping;
