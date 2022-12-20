import { EntityId } from '@reduxjs/toolkit';
declare enum ActionTypes {
    PICK_SCALE = "ducks/colorScales/PICK"
}
type PickAction = {
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
type Action = PickAction;
/**
 * Type for embedding state slice
 */
export type ColorScalesType = EntityId;
export default function colorScales(state?: EntityId, action?: Action): ColorScalesType;
export {};
