import { BaseColorScale } from "../../Ducks/ColorScalesDuck";
/**
 * Component that lets user pick from a list of color scales.
 */
export declare var ColorScaleSelectFull: ({ channelColor }: {
    channelColor: any;
}) => JSX.Element;
export declare var ColorScaleMenuItem: ({ scale }: {
    scale: BaseColorScale;
}) => JSX.Element;
export declare const ColorScaleSelect: import("react-redux").ConnectedComponent<({ channelColor }: {
    channelColor: any;
}) => JSX.Element, Pick<{
    channelColor: any;
}, never>>;
