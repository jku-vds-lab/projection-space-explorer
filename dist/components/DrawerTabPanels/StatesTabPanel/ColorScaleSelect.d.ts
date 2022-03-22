import { BaseColorScale } from '../../../model/Palette';
export declare function ColorScaleMenuItem({ scale }: {
    scale: BaseColorScale;
}): JSX.Element;
/**
 * Component that lets user pick from a list of color scales.
 */
export declare function ColorScaleSelectFull({ channelColor, active }: {
    channelColor: any;
    active: any;
}): JSX.Element;
export declare const ColorScaleSelect: import("react-redux").ConnectedComponent<typeof ColorScaleSelectFull, Pick<{
    channelColor: any;
    active: any;
}, "active" | "channelColor">>;
