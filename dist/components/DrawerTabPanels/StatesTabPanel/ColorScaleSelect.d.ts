import * as React from 'react';
import { BaseColorScale } from '../../../model/Palette';
import { CategoryOption } from '../../WebGLView/CategoryOptions';
export declare const ThumbSlider: import("@emotion/styled").StyledComponent<{
    color?: "primary" | "secondary";
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
} & import("@mui/base").SliderUnstyledOwnProps & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "key" | keyof React.HTMLAttributes<HTMLSpanElement>> & {
    ref?: React.Ref<HTMLSpanElement>;
}, "size" | "color" | "sx" | keyof import("@mui/base").SliderUnstyledOwnProps> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
export declare function ColorScaleMenuItem({ scale, skew }: {
    scale: BaseColorScale;
    skew?: number;
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
