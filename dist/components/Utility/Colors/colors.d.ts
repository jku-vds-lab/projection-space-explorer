import { DiscreteMapping } from "./Mapping";
import { ContinuousMapping } from "./Mapping";
import { Dataset } from "../../../model/Dataset";
import { BaseColorScale } from "../../Ducks/ColorScalesDuck";
export declare const mappingFromScale: (scale: BaseColorScale, attribute: any, dataset: Dataset) => DiscreteMapping | ContinuousMapping;
