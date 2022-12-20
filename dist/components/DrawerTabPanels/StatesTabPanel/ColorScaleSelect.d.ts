import * as React from 'react';
import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
/**
 * Custom styled slider that is positioned over a color scale to adjust the center.
 */
export declare const ThumbSlider: import("@emotion/styled").StyledComponent<{
    color?: "primary" | "secondary";
    classes?: Partial<import("@mui/material").SliderUnstyledClasses> & {
        colorPrimary?: string;
        colorSecondary?: string;
        sizeSmall?: string;
        thumbColorPrimary?: string;
        thumbColorSecondary?: string;
        thumbSizeSmall?: string;
    };
    size?: "small" | "medium";
    sx?: import("@mui/system").SxProps<import("@mui/material").Theme>;
} & {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-valuetext'?: string;
    classes?: Partial<import("@mui/material").SliderUnstyledClasses>;
    components?: {
        Root?: React.ElementType<any>;
        Track?: React.ElementType<any>;
        Rail?: React.ElementType<any>;
        Thumb?: React.ElementType<any>;
        Mark?: React.ElementType<any>;
        MarkLabel?: React.ElementType<any>;
        ValueLabel?: React.ElementType<any>;
    };
    componentsProps?: {
        root?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        track?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        rail?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        thumb?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        mark?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        markLabel?: React.HTMLAttributes<HTMLSpanElement> & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
        valueLabel?: import("@mui/material").ValueLabelUnstyledProps & import("@mui/material").SliderUnstyledComponentsPropsOverrides;
    };
    defaultValue?: number | number[];
    disabled?: boolean;
    disableSwap?: boolean;
    getAriaLabel?: (index: number) => string;
    getAriaValueText?: (value: number, index: number) => string;
    isRtl?: boolean;
    marks?: boolean | import("@mui/material").Mark[];
    max?: number;
    min?: number;
    name?: string;
    onChange?: (event: Event, value: number | number[], activeThumb: number) => void;
    onChangeCommitted?: (event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => void;
    orientation?: "vertical" | "horizontal";
    scale?: (value: number) => number;
    step?: number;
    tabIndex?: number;
    track?: false | "normal" | "inverted";
    value?: number | number[];
    valueLabelDisplay?: "auto" | "on" | "off";
    valueLabelFormat?: string | ((value: number, index: number) => React.ReactNode);
} & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "key" | keyof React.HTMLAttributes<HTMLSpanElement>> & {
    ref?: React.Ref<HTMLSpanElement>;
}, "value" | "size" | "track" | "name" | "classes" | "color" | "scale" | "sx" | "defaultValue" | "tabIndex" | "aria-label" | "aria-labelledby" | "aria-valuetext" | "onChange" | "max" | "min" | "orientation" | "disabled" | "step" | "components" | "componentsProps" | "disableSwap" | "getAriaLabel" | "getAriaValueText" | "isRtl" | "marks" | "onChangeCommitted" | "valueLabelDisplay" | "valueLabelFormat"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
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
