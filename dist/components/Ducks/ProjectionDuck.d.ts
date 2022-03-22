import { PayloadAction, EntityState, EntityId, Update } from '@reduxjs/toolkit';
import { IProjection, IPosition } from '../../model/ProjectionInterfaces';
export declare const projectionsSlice: import("@reduxjs/toolkit").Slice<ProjectionStateType, {
    loadById(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>, action: PayloadAction<EntityId>): void;
    add(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>, action: PayloadAction<IProjection>): void;
    copyFromWorkspace(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>): void;
    updateActive(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>, action: PayloadAction<{
        positions: IPosition[];
        metadata: any;
    }>): void;
    remove(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>, action: PayloadAction<EntityId>): void;
    save(state: import("immer/dist/internal").WritableDraft<ProjectionStateType>, action: PayloadAction<Update<IProjection>>): void;
}, "projections">;
/**
 * Type for embedding state slice
 */
export declare type ProjectionStateType = {
    values: EntityState<IProjection>;
    workspace: IProjection | EntityId;
};
export declare const embeddings: import("redux").Reducer<ProjectionStateType, import("redux").AnyAction>;
export declare const ProjectionActions: {
    loadById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    add: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IProjection, string>;
    copyFromWorkspace: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
    updateActive: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
        positions: IPosition[];
        metadata: any;
    }, string>;
    remove: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
    save: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Update<IProjection>, string>;
};
/**export const ProjectionSelectors = {
  getWorkspace: createSelector(
    (state: RootState) =>
      typeof state.projections.workspace === 'string' || typeof state.projections.workspace === 'number'
        ? state.projections.values.entities[state.projections.workspace]
        : state.projections.workspace,
    (items) => {
      return items;
    },
  ),
  workspaceIsTemporal: createSelector(
    (state: RootState) => typeof state.projections.workspace,
    (type) => {
      return type !== 'string' && type !== 'number';
    },
  ),
};*/
