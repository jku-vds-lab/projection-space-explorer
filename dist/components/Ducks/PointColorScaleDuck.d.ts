import { EntityId } from '@reduxjs/toolkit';
declare enum ActionTypes {
    PICK_SCALE = "ducks/colorScales/PICK"
}
declare type PickAction = {
    type: ActionTypes.PICK_SCALE;
    handle: string;
};
export declare const PointColorScaleActions: {
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
export declare type ColorScalesType = EntityId;
export default function colorScales(state?: string | number, action?: Action): ColorScalesType;
export {};
