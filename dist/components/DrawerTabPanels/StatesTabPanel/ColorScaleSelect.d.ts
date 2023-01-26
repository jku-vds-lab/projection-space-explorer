import * as React from 'react';
import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
/**
 * Custom styled slider that is positioned over a color scale to adjust the center.
 */
export declare const ThumbSlider: import("@emotion/styled").StyledComponent<{
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-valuetext'?: string;
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
        root?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        track?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        rail?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        thumb?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        mark?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        markLabel?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        valueLabel?: import("@mui/base").SlotComponentProps<typeof import("@mui/material/Slider/SliderValueLabel").default, import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        input?: import("@mui/base").SlotComponentProps<"input", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
    };
    classes?: Partial<import("@mui/material").SliderClasses>;
    defaultValue?: number | number[];
    disabled?: boolean;
    disableSwap?: boolean;
    getAriaLabel?: (index: number) => string;
    getAriaValueText?: (value: number, index: number) => string;
    marks?: boolean | import("@mui/base").Mark[];
    max?: number;
    min?: number;
    name?: string;
    onChange?: (event: Event, value: number | number[], activeThumb: number) => void;
    onChangeCommitted?: (event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => void;
    orientation?: "vertical" | "horizontal";
    scale?: (value: number) => number;
    size?: "small" | "medium";
    slotProps?: {
        root?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        track?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        rail?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        thumb?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        mark?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        markLabel?: import("@mui/base").SlotComponentProps<"span", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        valueLabel?: import("@mui/base").SlotComponentProps<typeof import("@mui/material/Slider/SliderValueLabel").default, import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
        input?: import("@mui/base").SlotComponentProps<"input", import("@mui/material").SliderComponentsPropsOverrides, import("@mui/material").SliderOwnerState>;
    };
    slots?: {
        root?: React.ElementType<any>;
        track?: React.ElementType<any>;
        rail?: React.ElementType<any>;
        thumb?: React.ElementType<any>;
        mark?: React.ElementType<any>;
        markLabel?: React.ElementType<any>;
        valueLabel?: React.ElementType<any>;
        input?: React.ElementType<any>;
    };
    step?: number;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme>;
    tabIndex?: number;
    track?: false | "normal" | "inverted";
    value?: number | number[];
    valueLabelDisplay?: "auto" | "on" | "off";
    valueLabelFormat?: string | ((value: number, index: number) => React.ReactNode);
} & import("@mui/material/OverridableComponent").CommonProps & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "key" | keyof React.HTMLAttributes<HTMLSpanElement>> & {
    ref?: React.Ref<HTMLSpanElement>;
}, "name" | "value" | "size" | "track" | keyof import("@mui/material/OverridableComponent").CommonProps | "color" | "scale" | "sx" | "defaultValue" | "tabIndex" | "aria-label" | "aria-labelledby" | "aria-valuetext" | "onChange" | "max" | "min" | "orientation" | "disabled" | "step" | "slotProps" | "slots" | "components" | "componentsProps" | "disableSwap" | "getAriaLabel" | "getAriaValueText" | "marks" | "onChangeCommitted" | "valueLabelDisplay" | "valueLabelFormat"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
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