import { IBaseProjection, IProjection } from './ProjectionInterfaces';
import { Dataset } from './Dataset';
/**
 * Projection API.
 */
export declare class AProjection {
    static createProjection(positions: IBaseProjection, name: any, metadata?: any): IProjection;
    static createManualProjection(dataset: Dataset, xChannel: string, yChannel: string): IProjection;
    /**
     * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
     * which is needed for the zoom to work correctly
     */
    static calculateBoundsFromPositions(spatial: IBaseProjection): {
        scaleBase: number;
        scaleFactor: number;
        x: {
            min: number;
            max: number;
        };
        y: {
            min: number;
            max: number;
        };
    };
    /**
     * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
     * which is needed for the zoom to work correctly
     */
    static calculateBounds(dataset: Dataset, xChannel: any, yChannel: any, positions?: any): {
        scaleBase: number;
        scaleFactor: number;
        x: {
            min: number;
            max: number;
        };
        y: {
            min: number;
            max: number;
        };
    };
}
