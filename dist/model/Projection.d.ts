import { IBaseProjection, IProjection } from './ProjectionInterfaces';
/**
 * Projection API.
 */
export declare class AProjection {
    static createProjection(projection: IBaseProjection, name: any, metadata?: any): IProjection;
}
