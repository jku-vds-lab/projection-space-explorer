import { SchemeColor } from '../components/Utility/Colors/SchemeColor';
declare type Palette = 'dark2' | 'accent' | 'paired' | 'YlOrRd' | 'Greys' | 'Viridis' | 'BrBG' | 'PRGn' | 'SHAP' | SchemeColor[];
export declare type BaseColorScale = {
    palette: Palette;
    type: 'sequential' | 'diverging' | 'categorical';
    dataClasses?: number;
};
export {};
