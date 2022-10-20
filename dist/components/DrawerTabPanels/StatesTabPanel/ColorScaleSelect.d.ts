import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
export declare function ColorScaleMenuItem({ scale }: {
    scale: BaseColorScale;
}): JSX.Element;
/**
 * Component that lets user pick from a list of color scales.
 */
export declare function ColorScaleSelectFull({ channelColor, active }: {
    channelColor: CategoryOption;
    active: any;
}): JSX.Element;
export declare const ColorScaleSelect: import("react-redux").ConnectedComponent<typeof ColorScaleSelectFull, import("react-redux").Omit<{
    channelColor: CategoryOption;
    active: any;
}, never>>;
