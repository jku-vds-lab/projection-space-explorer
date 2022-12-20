import { DatasetEntry } from '../../model/DatasetEntry';
import { ANormalized } from '../Utility/NormalizedState';

const SET = 'ducks/databaseentries/SET';

export function setDatasetEntriesAction(pdatasetEntries: Array<DatasetEntry>) {
  const dict = ANormalized.create<DatasetEntry>();

  for (const entry of pdatasetEntries) {
    ANormalized.add(dict, entry);
  }

  return {
    type: SET,
    ...dict,
  };
}

type InitialType = {
  values: {
    byId: { [id: string]: DatasetEntry };
    allIds: string[];
  };
};

const initialState: InitialType = {
  values: {
    byId: {},
    allIds: [],
  },
};

export class DatasetEntriesAPI {
  static getTypes(state: InitialType) {
    return [...new Set(Object.values(state.values.byId).map((value) => value.type))];
  }

  static getByPath(state: InitialType, path: string) {
    return Object.values(state.values.byId).find((e) => e.path === path);
  }
}

export default function datasetEntries(state = initialState, action): InitialType {
  switch (action.type) {
    case SET:
      return { ...state, values: { byId: action.byId, allIds: action.allIds } };
    default:
      return state;
  }
}
