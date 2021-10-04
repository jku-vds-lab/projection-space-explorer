import { ICluster } from "../../model/Cluster";
import { IVector } from "../../model/Vector";
export declare const setHoverState: (hoverState: any, updater: any) => {
    type: string;
    input: {
        data: any;
        updater: any;
    };
};
export declare type HoverStateType = {
    data: IVector | ICluster;
    updater: String;
};
declare const hoverState: (state: HoverStateType, action: any) => HoverStateType;
export default hoverState;
