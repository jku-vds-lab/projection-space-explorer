/**
 * Component that lets user pick from a list of color scales.
 */
export declare var ColorScaleSelectFull: ({ channelColor, pointColorScale, setPointColorScale }: {
    channelColor: any;
    pointColorScale: any;
    setPointColorScale: any;
}) => JSX.Element;
export declare var ColorScaleMenuItem: ({ scale }: {
    scale: any;
}) => JSX.Element;
export declare const ColorScaleSelect: import("react-redux").ConnectedComponent<({ channelColor, pointColorScale, setPointColorScale }: {
    channelColor: any;
    pointColorScale: any;
    setPointColorScale: any;
}) => JSX.Element, Pick<{
    channelColor: any;
    pointColorScale: any;
    setPointColorScale: any;
}, never>>;
