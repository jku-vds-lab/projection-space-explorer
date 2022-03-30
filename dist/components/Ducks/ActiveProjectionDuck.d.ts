import { EntityId } from '@reduxjs/toolkit';
export declare const setWorkspaceProjection: import("@reduxjs/toolkit").AsyncThunk<any, void, {}>;
export declare const setWorkspaceById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EntityId, string>;
export declare const activeProjectionReducer: import("@reduxjs/toolkit/dist/createReducer").ReducerWithInitialState<EntityId>;
