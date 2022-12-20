import type { IBaseProjection, Dataset } from '../../model';
export declare class LassoSelection {
    drawing: boolean;
    start: {
        x: any;
        y: any;
    };
    points: {
        x: any;
        y: any;
    }[];
    constructor();
    mouseDown(alt: any, x: any, y: any): void;
    mouseMove(x: any, y: any): void;
    mouseUp(x: any, y: any): void;
    selection(dataset: Dataset, positions: IBaseProjection, visible: any): any[];
    intersects: (seat: any) => boolean;
}
