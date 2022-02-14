import { Dataset } from '../../model';

export enum RootActionTypes {
  RESET = 'root/RESET',
  HYDRATE = 'root/HYDRATE',
  DATASET = 'root/DATASET',
}

export const RootActions = {
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
};
