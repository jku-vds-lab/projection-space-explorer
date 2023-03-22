import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Dataset } from '../../../model/Dataset';
import { DatasetDrop } from './DatasetDrop';
import { DownloadProgress } from './DownloadProgress';
import { PredefinedDatasets } from './PredefinedDatasets';
import { DatasetLoaderActions } from '../../Ducks';
import { DatasetEntry } from '../../../model/DatasetEntry';

export function DatasetTabPanel({ onDataSelected }: { onDataSelected(dataset: Dataset): void }) {
  const dispatch = useDispatch() as any;

  const fetchEntry = (entry: DatasetEntry) => {
    dispatch(DatasetLoaderActions.fetchDatasetByPath(entry));
  };

  const predefined = (
    <PredefinedDatasets
      onChange={(entry) => {
        fetchEntry(entry);
      }}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Custom datasets (drag and drop)
        </Typography>
      </Box>

      <DatasetDrop onChange={onDataSelected} />

      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Predefined datasets
        </Typography>
      </Box>

      {predefined}

      <DownloadProgress
        onCancel={() => {
          // setJob(null);
        }}
      />
    </div>
  );
}
