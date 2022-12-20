import { NormalizedDictionary } from '../Utility/NormalizedState';
import { BaseColorScale } from '../../model/Palette';
/**
 * Type for embedding state slice
 */
export type ColorScalesType = {
    scales: NormalizedDictionary<BaseColorScale>;
};
export default function colorScales(state?: ColorScalesType, action?: any): ColorScalesType;
