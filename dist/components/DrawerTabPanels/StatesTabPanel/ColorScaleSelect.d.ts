import * as React from 'react';
import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
/**
 * Custom styled slider that is positioned over a color scale to adjust the center.
 */
export declare const ThumbSlider: import("@emotion/styled").StyledComponent<import("@mui/material").SliderOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: React.Ref<HTMLSpanElement>;
}, "value" | "size" | "style" | "track" | "name" | "className" | "classes" | "color" | "scale" | "sx" | "defaultValue" | "tabIndex" | "aria-label" | "aria-labelledby" | "aria-valuetext" | "onChange" | "max" | "min" | "orientation" | "disabled" | "step" | "components" | "componentsProps" | "slots" | "slotProps" | "disableSwap" | "getAriaLabel" | "getAriaValueText" | "marks" | "onChangeCommitted" | "valueLabelDisplay" | "valueLabelFormat"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
/**
 * Renders one color scale with an optional center point.
 */
export declare function ColorScaleMenuItem({ scale, skew, deadzone }: {
    scale: BaseColorScale;
    skew?: number;
    deadzone?: number;
}): JSX.Element;
export default function NumberInput({ value, setValue, label }: {
    value: number;
    setValue: (_: number) => void;
    label: string;
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
//# sourceMappingURL=ColorScaleSelect.d.ts.map