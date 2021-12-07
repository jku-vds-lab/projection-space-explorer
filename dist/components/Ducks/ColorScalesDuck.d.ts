import { NormalizedDictionary } from "../Utility/NormalizedState";
import { SchemeColor } from "../Utility";
export declare const APalette: {
    getByName: (palette: string) => SchemeColor[];
};
declare enum ActionTypes {
    PICK_SCALE = "ducks/colorScales/PICK"
}
declare type PickAction = {
    type: ActionTypes.PICK_SCALE;
    handle: string;
};
export declare const ColorScalesActions: {
    pickScale: (handle: string) => {
        type: ActionTypes;
        handle: string;
    };
    initScaleByType: (type: string) => (dispatch: any, getState: any) => any;
};
declare type Action = PickAction;
declare type Palette = 'dark2' | 'accent' | 'paired' | SchemeColor[];
/**
 * Type for embedding state slice
 */
declare type StateType = {
    scales: NormalizedDictionary<BaseColorScale>;
    active: string;
};
export declare type BaseColorScale = {
    palette: Palette;
    type: 'sequential' | 'diverging' | 'categorical';
    dataClasses?: number;
};
export default function colorScales(state?: StateType, action?: Action): StateType;
export {};
