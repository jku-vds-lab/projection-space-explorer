import { ICluster } from '../../model/ICluster';
import { IVector } from '../../model/Vector';
export declare const setHoverState: (hoverState: any, updater: any) => {
    type: string;
    input: {
        data: any;
        updater: any;
    };
};
export type HoverStateType = {
    data: IVector | ICluster;
    updater: string;
};
declare const hoverState: (state: HoverStateType, action: any) => HoverStateType;
export default hoverState;
