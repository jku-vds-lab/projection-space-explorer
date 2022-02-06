import { IPosition } from ".";

export type CubicBezierCurve = {
    start: IPosition;
    cp1: IPosition;
    cp2: IPosition;
    end: IPosition;
}