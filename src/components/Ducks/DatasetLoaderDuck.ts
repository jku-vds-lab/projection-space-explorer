import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import * as d3v5 from 'd3v5';
import { AVector, Dataset, DatasetEntry } from '../../model';
import { DownloadJob } from '../DrawerTabPanels/DatasetTabPanel/DownloadJob';
import { RootActions } from '../Store/RootActions';
import { CSVLoader } from '../Utility/Loaders/CSVLoader';
import { JSONLoader } from '../Utility/Loaders/JSONLoader';

function convertFromCSV(vectors) {
  return vectors.map((vector) => {
    return AVector.create(vector);
  });
}

const initialState = {
  isFetching: false,
  progress: 0,
  entry: null as DatasetEntry,
};

const setProgress = createAction<number>('dataset/progress');

const fetchDatasetByPath = createAsyncThunk('dataset/fetchByPath', async (entry: DatasetEntry, { dispatch }) => {
  const downloadJob = new DownloadJob(entry);

  const response = await fetch(entry.path);
  const result = await downloadJob.download(
    response,
    () => {},
    (value) => {
      dispatch(setProgress(value));
    },
  );

  const onDataSelected = (dataset: Dataset) => {
    dispatch(RootActions.loadDataset(dataset));
  };

  if (entry.path.endsWith('json')) {
    new JSONLoader().resolve(JSON.parse(result), onDataSelected, entry.type, entry);
  } else {
    new CSVLoader().resolve(onDataSelected, convertFromCSV(d3v5.csvParse(result)), entry.type, entry);
  }

  return result;
});

export const datasetLoader = createReducer(initialState, (builder) => {
  builder
    .addCase(setProgress, (state, action) => {
      state.progress = action.payload;
    })
    .addCase(fetchDatasetByPath.pending, (state) => {
      state.isFetching = true;
    })
    .addCase(fetchDatasetByPath.fulfilled, (state) => {
      state.isFetching = false;
    })
    .addCase(fetchDatasetByPath.rejected, (state) => {
      state.isFetching = false;
    });
});

export const DatasetLoaderActions = {
  fetchDatasetByPath,
};
