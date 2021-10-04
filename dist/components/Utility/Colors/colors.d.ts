import { DiscreteScale } from "./ContinuosScale";
import { DiscreteMapping } from "./Mapping";
import { ContinuousMapping } from "./Mapping";
import { Dataset } from "../../../model/Dataset";
import { LinearColorScale } from "./LinearColorScale";
export declare const mappingFromScale: (scale: LinearColorScale, attribute: any, dataset: Dataset) => DiscreteMapping | ContinuousMapping;
export declare function defaultScalesForAttribute(attribute: any): DiscreteScale[];
