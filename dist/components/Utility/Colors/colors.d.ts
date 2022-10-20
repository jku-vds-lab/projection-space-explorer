import { DiscreteMapping, ContinuousMapping, DivergingMapping } from './Mapping';
import { Dataset } from '../../../model/Dataset';
import { BaseColorScale } from '../../../model/Palette';
export declare const mappingFromScale: (scale: BaseColorScale, attribute: any, dataset: Dataset) => DiscreteMapping | DivergingMapping | ContinuousMapping;
