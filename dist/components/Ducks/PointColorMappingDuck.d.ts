import { DiscreteMapping, ContinuousMapping } from "..";
export declare const setPointColorMapping: (pointColorMapping: any) => {
    type: string;
    pointColorMapping: any;
};
declare const pointColorMapping: (state: any, action: any) => DiscreteMapping | ContinuousMapping;
export default pointColorMapping;
