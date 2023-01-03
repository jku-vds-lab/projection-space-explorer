import { SchemeColor } from '../components/Utility/Colors/SchemeColor';
type Palette = 'dark2' | 'accent' | 'paired' | 'YlOrRd' | 'Greys' | 'Viridis' | 'BrBG' | 'PRGn' | 'SHAP' | SchemeColor[];
export type BaseColorScale = {
    palette: Palette;
    type: 'sequential' | 'diverging' | 'categorical';
    dataClasses?: number;
};
export {};
//# sourceMappingURL=Palette.d.ts.map