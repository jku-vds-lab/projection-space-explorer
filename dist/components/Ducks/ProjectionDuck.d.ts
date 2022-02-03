import { EntityState, EntityId, Update } from '@reduxjs/toolkit';
import { IProjection, IBaseProjection, IPosition } from '../../model/ProjectionInterfaces';
/**
 * Type for embedding state slice
 */
export declare type ProjectionStateType = {
    values: EntityState<IProjection>;
    workspace: IBaseProjection;
};
export declare const embeddings: import("redux").Reducer<ProjectionStateType, import("redux").AnyAction>;
export declare const ProjectionActions: {
    add: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IProjection, string>;
    updateActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IPosition[], string>;
    remove: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    save: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Update<IProjection>, string>;
};
