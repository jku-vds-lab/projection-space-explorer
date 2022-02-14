import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction, createEntityAdapter, EntityState, EntityId, Update, createSelector } from '@reduxjs/toolkit';
import { IProjection, IPosition } from '../../model/ProjectionInterfaces';
import type { RootState } from '../Store';

const projectionAdapter = createEntityAdapter<IProjection>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (projection) => projection.hash,
});

const initialState: ProjectionStateType = {
  values: projectionAdapter.getInitialState(),
  workspace: undefined,
};

const projectionsSlice = createSlice({
  name: 'projections',
  initialState,
  reducers: {
    loadById(state, action: PayloadAction<EntityId>) {
      state.workspace = action.payload;
    },
    add(state, action: PayloadAction<IProjection>) {
      projectionAdapter.addOne(state.values, action.payload);
    },
    copyFromWorkspace(state) {
      const deriveName = (metadata) => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

        return `${metadata?.method} at ${time}`;
      };

      if (typeof state.workspace === 'string' || typeof state.workspace === 'number') {
        const workspace = state.values.entities[state.workspace];
        const hash = uuidv4();
        projectionAdapter.addOne(state.values, { ...workspace, hash });
        state.workspace = hash;
      } else {
        const { workspace } = state;
        projectionAdapter.addOne(state.values, { ...workspace, name: workspace.name ?? deriveName(workspace.metadata) });
        state.workspace = workspace.hash;
      }
    },
    updateActive(state, action: PayloadAction<{ positions: IPosition[]; metadata: any }>) {
      if (typeof state.workspace === 'string' || typeof state.workspace === 'number') {
        state.workspace = {
          hash: uuidv4(),
          positions: action.payload.positions,
          metadata: action.payload.metadata,
          name: null,
        };
      } else {
        state.workspace.positions = action.payload.positions;
        state.workspace.metadata = action.payload.metadata;
      }
    },
    remove(state, action: PayloadAction<EntityId>) {
      if (typeof state.workspace === 'string' || typeof state.workspace === 'number') {
        state.workspace = { ...state.values.entities[state.workspace], hash: uuidv4() };
      }
      projectionAdapter.removeOne(state.values, action.payload);
    },
    save(state, action: PayloadAction<Update<IProjection>>) {
      projectionAdapter.updateOne(state.values, action.payload);
    },
  },
});

/**
 * Type for embedding state slice
 */
export type ProjectionStateType = {
  values: EntityState<IProjection>;

  // current projection that is in the scatterplot
  workspace: IProjection | EntityId;
};

export const embeddings = projectionsSlice.reducer;
export const ProjectionActions = { ...projectionsSlice.actions };

export const ProjectionSelectors = {
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
};
