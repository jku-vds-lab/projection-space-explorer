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
  ReducersMapObject,
  EntityState,
  Reducer,
  ActionReducerMapBuilder,
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
import { ContinuousMapping, DiscreteMapping, Mapping } from '../Utility/Colors';
import { CategoryOption } from '../WebGLView/CategoryOptions';

export const setWorkspaceAction = createAction<EntityId | IProjection>('set/workspace');

const workspaceReducer = createReducer<EntityId | IProjection>(null, (builder) => {
  builder.addCase(setWorkspaceAction, (state, action) => {
    return action.payload;
  });
});

const pointColorMappingReducer = createReducer<Mapping>(null, (builder) => {
  builder.addDefaultCase((state) => {
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

const allReducers = {
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
};

const addView = createAction<Dataset>('view/addView');
const activateView = createAction<EntityId>('view/activateView');
const deleteView = createAction<EntityId>('view/deleteView');
const loadById = createAction<EntityId>('view/loadById');
const add = createAction<IProjection>('view/add');
const copyFromWorkspace = createAction('view/copyFromWorkspace');
const updateActive = createAction<{ positions: IPosition[]; metadata: any }>('view/updateActive');
const remove = createAction<EntityId>('view/remove');
const save = createAction<Update<IProjection>>('view/save');
const setPointColorMapping = createAction<{ multipleId: EntityId; value: DiscreteMapping | ContinuousMapping }>('view/setPointColorMapping');
const selectChannel = createAction<{ dataset: Dataset; channel: 'x' | 'y'; value: string }>('view/selectChannel');
const changeDivergingRange = createAction<[number, number, number] | [number, number]>('view/chagneDivergingrange');

type StateType<T> = {
  multiples: EntityState<{
    id: EntityId;
    attributes: SingleMultipleAttributes & T;
  }>;
  active: EntityId;
  projections: EntityState<IProjection>;
};

export function createViewDuckReducer<T>(
  additionalViewReducer?: ReducersMapObject<T, any>,
  additionalCustomCases?: (builder: ActionReducerMapBuilder<StateType<T>>) => void,
) {
  const viewReducer = additionalViewReducer
    ? combineReducers({ ...allReducers, ...additionalViewReducer })
    : (combineReducers({ ...allReducers }) as Reducer<any>);

  return createSlice({
    name: 'multiples',
    initialState: initialState as StateType<T>,
    reducers: {},
    extraReducers: (builder) => {
      if (additionalCustomCases) additionalCustomCases(builder);

      builder
        .addCase(changeDivergingRange, (state, action) => {
          const active = state.multiples.entities[state.active].attributes;
          if (active.pointColorMapping.type === 'diverging' || active.pointColorMapping.type === 'sequential') {
            active.pointColorMapping.range = action.payload;
          }
        })
        .addCase(addView, (state, action) => {
          const defaultAtts = defaultAttributes(action.payload);
          // if(state.multiples.ids.length > 0){ // if there is a default view, initialize the viewTransform with those
          //   defaultAtts.viewTransform = state.multiples.entities[state.multiples.ids[0]].attributes.viewTransform
          // }
          multipleAdapter.addOne(state.multiples, {
            id: uuidv4(),
            attributes: viewReducer(defaultAtts, { type: '' }),
          });
        })
        .addCase(activateView, (state, action) => {
          state.active = action.payload;
        })
        .addCase(deleteView, (state, action) => {
          multipleAdapter.removeOne(state.multiples, action.payload);
          if (action.payload === state.active) {
            state.active = state.multiples.ids[0];
          }
        })
        .addCase(loadById, (state, action) => {
          const active = state.multiples.entities[state.active];
          active.attributes.workspace = action.payload;
        })
        .addCase(add, (state, action) => {
          projectionAdapter.addOne(state.projections, action.payload);
        })
        .addCase(copyFromWorkspace, (state) => {
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
        })
        .addCase(updateActive, (state, action: PayloadAction<{ positions: IPosition[]; metadata: any }>) => {
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
        })
        .addCase(remove, (state, action: PayloadAction<EntityId>) => {
          const active = state.multiples.entities[state.active];

          if (isEntityId(active.attributes.workspace)) {
            active.attributes.workspace = { ...state.projections.entities[active.attributes.workspace], hash: uuidv4() };
          }

          projectionAdapter.removeOne(state.projections, action.payload);
        })
        .addCase(save, (state, action: PayloadAction<Update<IProjection>>) => {
          projectionAdapter.updateOne(state.projections, action.payload);
        })
        .addCase(setPointColorMapping, (state, action: PayloadAction<{ multipleId: EntityId; value: DiscreteMapping | ContinuousMapping }>) => {
          const { multipleId, value } = action.payload;
          const multiple = state.multiples.entities[multipleId];
          multiple.attributes.pointColorMapping = value;
        })
        .addCase(selectChannel, (state, action: PayloadAction<{ dataset: Dataset; channel: 'x' | 'y'; value: string }>) => {
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
        })
        .addDefaultCase((state, action) => {
          if ('multipleId' in action) {
            const active = state.multiples.entities[action.multipleId];
            if (active != null) {
              active.attributes = viewReducer(active.attributes, action);
            }
          } else if (state.active !== null) {
            const active = state.multiples.entities[state.active];
            if (active != null) {
              active.attributes = viewReducer(active.attributes, action);
            }
          } else if (state.multiples.ids.length > 0) {
            const active = state.multiples.entities[state.multiples.ids[0]];
            if (active != null) {
              active.attributes = viewReducer(active.attributes, action);
            }
          }
        });
    },
  });
}

const defaultSelector = (state: RootState) => state.multiples.multiples.entities[state.multiples.active];

export const ViewActions = {
  addView,
  activateView,
  deleteView,
  loadById,
  add,
  copyFromWorkspace,
  updateActive,
  remove,
  save,
  setPointColorMapping,
  selectChannel,
  changeDivergingRange,
};

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
