import { SchemeColor } from './SchemeColor';
import { ContinuousMapping, DiscreteMapping } from './Mapping';
import { BaseColorScale } from '../../Ducks/ColorScalesDuck';
export declare class ScaleUtil {
    static mapScale(scale: BaseColorScale, value: any): SchemeColor;
    static mappingFromScale(scale: BaseColorScale, attribute: any, dataset: any): DiscreteMapping | ContinuousMapping;
}
