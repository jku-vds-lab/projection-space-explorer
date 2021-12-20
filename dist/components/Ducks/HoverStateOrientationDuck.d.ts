export declare enum HoverStateOrientation {
    SouthWest = 0,
    NorthEast = 1
}
declare const hoverStateOrientation: (state: HoverStateOrientation, action: any) => any;
export declare const setHoverStateOrientation: (hoverStateOrientation: any) => {
    type: string;
    hoverStateOrientation: any;
};
export default hoverStateOrientation;
