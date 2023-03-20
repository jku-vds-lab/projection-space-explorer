import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { DatasetEntry } from '../../model';
import { DownloadJob } from '../DrawerTabPanels/DatasetTabPanel/DownloadJob';

const initialState = {
  isFetching: false,
  entry: null as DatasetEntry,
};

const fetchDatasetByPath = createAsyncThunk('dataset/fetchByPath', async (entry: DatasetEntry) => {
  const downloadJob = new DownloadJob(entry);

  const response = await fetch(entry.path);
  const result = await downloadJob.download(
    response,
    () => {},
    (value) => console.log(value),
  );

  console.log(result);
  return result;
});

export const datasetLoader = createReducer(initialState, (builder) => {
  builder
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
