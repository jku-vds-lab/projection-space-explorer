import { NormalizedDictionary } from '../Utility/NormalizedState';
import { BaseColorScale } from '../../model/Palette';
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
/**
 * Type for embedding state slice
 */
declare type StateType = {
    scales: NormalizedDictionary<BaseColorScale>;
    active: string;
};
export default function colorScales(state?: StateType, action?: Action): StateType;
export {};
