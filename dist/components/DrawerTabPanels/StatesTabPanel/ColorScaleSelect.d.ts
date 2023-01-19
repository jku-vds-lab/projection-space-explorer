import * as React from 'react';
import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
/**
 * Custom styled slider that is positioned over a color scale to adjust the center.
 */
export declare const ThumbSlider: import("@emotion/styled").StyledComponent<{
    color?: "primary" | "secondary";
    components?: {
        Root?: React.ElementType<any>;
        Track?: React.ElementType<any>;
        Rail?: React.ElementType<any>;
        Thumb?: React.ElementType<any>;
        Mark?: React.ElementType<any>;
        MarkLabel?: React.ElementType<any>;
        ValueLabel?: React.ElementType<any>;
        Input?: React.ElementType<any>;
    };
    componentsProps?: {
        root?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        track?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        rail?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        thumb?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        mark?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        markLabel?: import("@mui/base").SlotComponentProps<"span", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        valueLabel?: import("@mui/base").SlotComponentProps<typeof import("@mui/base").SliderValueLabelUnstyled, import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
        input?: import("@mui/base").SlotComponentProps<"input", import("@mui/base").SliderUnstyledComponentsPropsOverrides, import("@mui/base").SliderUnstyledOwnerState>;
    };
    classes?: Partial<import("@mui/base").SliderUnstyledClasses> & {
        colorPrimary?: string;
        colorSecondary?: string;
        sizeSmall?: string;
        thumbColorPrimary?: string;
        thumbColorSecondary?: string;
        thumbSizeSmall?: string;
    };
    size?: "small" | "medium";
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme>;
} & Omit<import("@mui/base").SliderUnstyledOwnProps, "isRtl"> & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "key" | keyof React.HTMLAttributes<HTMLSpanElement>> & {
    ref?: React.Ref<HTMLSpanElement>;
}, "name" | "value" | "size" | "track" | "classes" | "color" | "scale" | "sx" | "defaultValue" | "tabIndex" | "aria-label" | "aria-labelledby" | "aria-valuetext" | "onChange" | "max" | "min" | "orientation" | "disabled" | "step" | "components" | "componentsProps" | "slotProps" | "slots" | "disableSwap" | "getAriaLabel" | "getAriaValueText" | "marks" | "onChangeCommitted" | "valueLabelDisplay" | "valueLabelFormat"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
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