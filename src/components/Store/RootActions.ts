import { Dataset, IVector } from '../../model';

export enum RootActionTypes {
  RESET = 'root/RESET',
  HYDRATE = 'root/HYDRATE',
  DATASET = 'root/DATASET',
  HARD_RESET = 'root/HARD_RESET',
  ADD_DATA = 'root/ADD_DATA',
}

/** const reset = createAction('root/RESET');
const hydrate = createAction<any>('root/HYDRATE');
const addData = createAction<IVector[]>('root/ADD_DATA');
const loadDataset = createAction<{ dataset: Dataset; dump?: any }>('root/DATASET');
const hardReset = createAction('root/HARD_RESET'); */

export const RootActions = {
  // Soft reset (keeping the dataset)
  reset: () => ({
    type: RootActionTypes.RESET,
  }),

  hydrate: (dump: any) => ({
    type: RootActionTypes.HYDRATE,
    dump,
  }),

  addData: <T extends IVector>(data: T) => ({
    type: RootActionTypes.ADD_DATA,
    data,
  }),

  loadDataset: (dataset: Dataset, dump?: any) => ({
    type: RootActionTypes.DATASET,
    dataset,
    dump,
  }),

  // Hard reset (throwing whole state away)
  hardReset: () => ({
    type: RootActionTypes.HARD_RESET,
  }),
};
