import { IBaseProjection, IProjection } from './ProjectionInterfaces';
/**
 * Projection API.
 */
export declare class AProjection {
    static createProjection(positions: IBaseProjection, name: any, metadata?: any): IProjection;
    static createManualProjection(xChannel: string, yChannel: string): IProjection;
}
