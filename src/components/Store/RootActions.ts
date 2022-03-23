import { Dataset } from '../../model';

export enum RootActionTypes {
  RESET = 'root/RESET',
  HYDRATE = 'root/HYDRATE',
  DATASET = 'root/DATASET',
  HARD_RESET = 'root/HARD_RESET',
}

export const RootActions = {
  // Soft reset (keeping the dataset)
  reset: () => ({
    type: RootActionTypes.RESET,
  }),

  hydrate: (dump: any) => ({
    type: RootActionTypes.HYDRATE,
    dump,
  }),

  loadDataset: (dataset: Dataset) => ({
    type: RootActionTypes.DATASET,
    dataset,
  }),

  // Hard reset (throwing whole state away)
  hardReset: () => ({
    type: RootActionTypes.HARD_RESET,
  }),
};
