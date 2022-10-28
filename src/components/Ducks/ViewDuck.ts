import { v4 as uuidv4 } from 'uuid';
import {
  createSlice,
  combineReducers,
  createEntityAdapter,
  EntityId,
  PayloadAction,
  createReducer,
  createAction,
  Update,
  createSelector,
} from '@reduxjs/toolkit';
import { channelColor } from './ChannelColorDuck';
import { channelSize } from './ChannelSize';
import { channelBrightness } from './ChannelBrightnessDuck';
import vectorByShape from './VectorByShapeDuck';
import lineBrightness from './LineBrightnessDuck';
import pointColorScale from './PointColorScaleDuck';
import pathLengthRange from './PathLengthRange';
import globalPointBrightness from './GlobalPointBrightnessDuck';
import globalPointSize from './GlobalPointSizeDuck';
import { ViewTransformType, viewTransform } from './ViewTransformDuck';
import type { RootState } from '../Store';
import { IProjection, ProjectionMethod, IPosition, Dataset, AProjection } from '../../model';
import { Mapping } from '../Utility';
import { CategoryOption } from '../WebGLView/CategoryOptions';

export const setWorkspaceAction = createAction<EntityId | IProjection>('set/workspace');

const workspaceReducer = createReducer<EntityId | IProjection>(null, (builder) => {
  builder.addCase(setWorkspaceAction, (state, action) => {
    return action.payload;
  });
});

const pointColorMappingReducer = createReducer<Mapping>(null, (builder) => {
  builder.addDefaultCase((state, action) => {
    return state;
  });
});

export const projectionAdapter = createEntityAdapter<IProjection>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (projection) => projection.hash,
});

export function defaultAttributes(dataset?: Dataset) {
  const workspace = dataset
    ? AProjection.createProjection(
        dataset.vectors.map((vector) => ({ x: vector.x, y: vector.y })),
        'Random Initialisation',
        { method: ProjectionMethod.RANDOM },
      )
    : null;

  return {
    channelBrightness: null,
    channelColor: null,
    channelSize: null,
    vectorByShape: null,
    viewTransform: {
      zoom: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    },
    lineBrightness: 30,
    pointColorScale: null,
    pointColorMapping: null,
    pathLengthRange: { range: [0, 100], maximum: 100 },
    globalPointBrightness: [1],
    globalPointSize: [1],
    workspace,
  };
}

export const attributesSlice = createSlice({
  name: 'attributes',
  initialState: defaultAttributes(),
  reducers: {},
});

export type SingleMultipleAttributes = {
  channelColor: CategoryOption;
  channelBrightness: CategoryOption;
  channelSize: CategoryOption;
  vectorByShape: CategoryOption;
  viewTransform: ViewTransformType;
  lineBrightness: number;
  pointColorScale: number | string;
  pointColorMapping: Mapping;
  pathLengthRange: { range: number[]; maximum: number };
  globalPointSize: number[];
  globalPointBrightness: number[];
  workspace: number | string | IProjection;
};

export type SingleMultiple = {
  id: number | string;
  attributes: SingleMultipleAttributes;
};

export const multipleAdapter = createEntityAdapter<SingleMultiple>({
  selectId: (multiple) => multiple.id,
});

const initialState = {
  multiples: multipleAdapter.getInitialState(),
  active: null as number | string,
  projections: projectionAdapter.getInitialState(),
};

export function isEntityId(value: string | number | IProjection): value is EntityId {
  return typeof value === 'string' || typeof value === 'number';
}

export const singleTestReducer = combineReducers({
  channelColor,
  channelSize,
  channelBrightness,
  vectorByShape,
  viewTransform,
  lineBrightness,
  pointColorMapping: pointColorMappingReducer,
  pointColorScale,
  pathLengthRange,
  globalPointSize,
  globalPointBrightness,
  workspace: workspaceReducer,
});

export const multiplesSlice = createSlice({
  name: 'multiples',
  initialState,
  reducers: {
    addView(state, action: PayloadAction<Dataset>) {
      multipleAdapter.addOne(state.multiples, {
        id: uuidv4(),
        attributes: defaultAttributes(action.payload),
      });
    },
    activateView(state, action: PayloadAction<EntityId>) {
      state.active = action.payload;
    },
    deleteView(state, action: PayloadAction<EntityId>) {
      multipleAdapter.removeOne(state.multiples, action.payload);
      if (action.payload === state.active) {
        state.active = state.multiples.ids[0];
      }
    },

    loadById(state, action: PayloadAction<EntityId>) {
      const active = state.multiples.entities[state.active];
      active.attributes.workspace = action.payload;
    },
    add(state, action: PayloadAction<IProjection>) {
      projectionAdapter.addOne(state.projections, action.payload);
    },
    copyFromWorkspace(state) {
      const active = state.multiples.entities[state.active];

      const deriveName = (metadata) => {
        if (metadata?.method === ProjectionMethod.RANDOM) {
          return 'Random Initialisation';
        }
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

        return `${metadata?.method} at ${time}`;
      };

      if (typeof active.attributes.workspace === 'string' || typeof active.attributes.workspace === 'number') {
        const workspace = state.projections.entities[active.attributes.workspace];
        const hash = uuidv4();
        projectionAdapter.addOne(state.projections, { ...workspace, hash });
        active.attributes.workspace = hash;
      } else {
        const { workspace } = active.attributes;
        projectionAdapter.addOne(state.projections, { ...workspace, name: deriveName(workspace.metadata) });
        active.attributes.workspace = workspace.hash;
      }
    },
    updateActive(state, action: PayloadAction<{ positions: IPosition[]; metadata: any }>) {
      const active = state.multiples.entities[state.active];

      const bounds = AProjection.calculateBounds(undefined, undefined, undefined, action.payload.positions);

      if (typeof active.attributes.workspace === 'string' || typeof active.attributes.workspace === 'number') {
        active.attributes.workspace = {
          hash: uuidv4(),
          positions: action.payload.positions,
          metadata: action.payload.metadata,
          name: null,
          xChannel: undefined,
          yChannel: undefined,
          bounds,
        };
      } else {
        active.attributes.workspace.positions = action.payload.positions;
        active.attributes.workspace.metadata = action.payload.metadata;
        active.attributes.workspace.xChannel = undefined;
        active.attributes.workspace.yChannel = undefined;
        active.attributes.workspace.bounds = bounds;
      }
    },
    remove(state, action: PayloadAction<EntityId>) {
      const active = state.multiples.entities[state.active];

      if (isEntityId(active.attributes.workspace)) {
        active.attributes.workspace = { ...state.projections.entities[active.attributes.workspace], hash: uuidv4() };
      }
      projectionAdapter.removeOne(state.projections, action.payload);
    },
    save(state, action: PayloadAction<Update<IProjection>>) {
      projectionAdapter.updateOne(state.projections, action.payload);
    },
    setPointColorMapping(state, action: PayloadAction<{ multipleId: EntityId; value: Mapping }>) {
      const { multipleId, value } = action.payload;
      const multiple = state.multiples.entities[multipleId];
      multiple.attributes.pointColorMapping = value;
    },
    changeDivergingRange(state, action: PayloadAction<[number, number, number] | [number, number]>) {
      const active = state.multiples.entities[state.active].attributes;
      if (active.pointColorMapping.type === 'diverging' || active.pointColorMapping.type === 'sequential') {
        active.pointColorMapping.range = action.payload;
      }
    },
    selectChannel(state, action: PayloadAction<{ dataset: Dataset; channel: 'x' | 'y'; value: string }>) {
      const active = state.multiples.entities[state.active].attributes;

      if (isEntityId(active.workspace)) {
        // Create new temporary projection

        active.workspace = {
          hash: uuidv4(),
          positions: null,
          metadata: { method: ProjectionMethod.CUSTOM },
          name: null,
        };
      }

      if (action.payload.channel === 'x') {
        active.workspace.xChannel = action.payload.value;
        active.workspace.bounds = AProjection.calculateBounds(action.payload.dataset, action.payload.value, undefined, undefined);
      } else {
        active.workspace.yChannel = action.payload.value;
        active.workspace.bounds = AProjection.calculateBounds(action.payload.dataset, undefined, action.payload.value, undefined);
      }

      if (!active.workspace.xChannel && !active.workspace.yChannel) {
        active.workspace.positions = action.payload.dataset.vectors.map((vector) => ({ x: vector.x, y: vector.y }));
        active.workspace.bounds = AProjection.calculateBounds(action.payload.dataset, undefined, undefined, active.workspace.positions);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state, action) => {
      if (state.active !== null) {
        const active = state.multiples.entities[state.active];
        active.attributes = singleTestReducer(active.attributes, action);
      } else if (state.multiples.ids.length > 0) {
        const active = state.multiples.entities[state.multiples.ids[0]];
        active.attributes = singleTestReducer(active.attributes, action);
      }
    });
  },
});

const defaultSelector = (state: RootState) => state.multiples.multiples.entities[state.multiples.active];

export const ViewActions = { ...multiplesSlice.actions };

export const ViewSelector = {
  selectAll: createSelector(
    (state: RootState) => state.multiples,
    (multiples) => multiples,
  ),
  defaultSelector,
  getWorkspaceById: createSelector(
    [
      // Usual first input - extract value from `state`
      (state: RootState) => state.multiples,
      // Take the second arg, `category`, and forward to the output selector
      (state, multipleId: EntityId) => multipleId,
    ],
    // Output selector gets (`items, category)` as args
    (multiples, multipleId) => {
      const active = multiples.multiples.entities[multipleId];
      const { workspace } = active.attributes;

      return typeof workspace === 'string' || typeof workspace === 'number' ? multiples.projections.entities[workspace] : workspace;
    },
  ),
  getWorkspace: createSelector(
    (state: RootState) => {
      const active = state.multiples.multiples.entities[state.multiples.active];
      if (active === undefined) {
        return null;
      }
      return typeof active.attributes.workspace === 'string' || typeof active.attributes.workspace === 'number'
        ? state.multiples.projections.entities[active.attributes.workspace]
        : active.attributes.workspace;
    },
    (items) => {
      return items;
    },
  ),
  workspaceIsTemporal: createSelector(
    (state: RootState) => typeof state.multiples.multiples.entities[state.multiples.active]?.attributes.workspace,
    (type) => {
      return type !== 'string' && type !== 'number';
    },
  ),
};
