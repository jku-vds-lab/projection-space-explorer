import { createSlice, PayloadAction, createEntityAdapter, EntityState, EntityId, Update } from '@reduxjs/toolkit';
import { IProjection, IBaseProjection, IPosition } from '../../model/ProjectionInterfaces';

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
    addProjection(state, action: PayloadAction<IProjection>) {
      projectionAdapter.addOne(state.values, action.payload);
    },
    updateActive(state, action: PayloadAction<IPosition[]>) {
      state.workspace = action.payload;
    },
    deleteProjection(state, action: PayloadAction<EntityId>) {
      projectionAdapter.removeOne(state.values, action.payload);
    },
    saveProjetion(state, action: PayloadAction<Update<IProjection>>) {
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
  workspace: IBaseProjection;
};

export const embeddings = projectionsSlice.reducer;
export const ProjectionActions = {
  add: projectionsSlice.actions.addProjection,
  updateActive: projectionsSlice.actions.updateActive,
  remove: projectionsSlice.actions.deleteProjection,
  save: projectionsSlice.actions.saveProjetion,
};
