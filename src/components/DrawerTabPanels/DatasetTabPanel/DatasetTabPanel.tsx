import { Box, Typography, Button } from '@mui/material';
import * as React from 'react';
import * as d3v5 from 'd3v5';
import { Dataset } from '../../../model/Dataset';
import { AVector } from '../../../model/Vector';
import { CSVLoader } from '../../Utility/Loaders/CSVLoader';
import { JSONLoader } from '../../Utility/Loaders/JSONLoader';
import { DatasetDrop } from './DatasetDrop';
import { DownloadJob } from './DownloadJob';
import { DownloadProgress } from './DownloadProgress';
import { PredefinedDatasets } from './PredefinedDatasets';

const onClickPersist = async () => {
  const content = '';

  // @ts-ignore
  const handle = await window.showSaveFilePicker({
    suggestedName: 'session.pse',
    types: [
      {
        description: 'PSE Session',
        accept: {
          'text/plain': ['.pse'],
        },
      },
    ],
  });

  const writable = await handle.createWritable();
  writable.write(content);
  await writable.close();

  return handle;
};

const onClickHydrate = async () => {
  // @ts-ignore
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();

  return contents;
};

function convertFromCSV(vectors) {
  return vectors.map((vector) => {
    return AVector.create(vector);
  });
}

export function DatasetTabPanel({ onDataSelected }: { onDataSelected(dataset: Dataset): void }) {
  const [job, setJob] = React.useState(null);

  const predefined = (
    <PredefinedDatasets
      onChange={(entry) => {
        setJob(new DownloadJob(entry));
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

      <Box sx={{ display: 'flex' }}>
        <Button onClick={onClickPersist}>Persist</Button>
        <Button onClick={onClickHydrate}>Hydrate</Button>
      </Box>

      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Predefined datasets
        </Typography>
      </Box>

      {predefined}

      <DownloadProgress
        job={job}
        onFinish={(result) => {
          if (job.entry.path.endsWith('json')) {
            new JSONLoader().resolve(JSON.parse(result), onDataSelected, job.entry.type, job.entry);
          } else {
            new CSVLoader().resolve(onDataSelected, convertFromCSV(d3v5.csvParse(result)), job.entry.type, job.entry);
          }

          setJob(null);
        }}
        onCancel={() => {
          setJob(null);
        }}
      />
    </div>
  );
}
