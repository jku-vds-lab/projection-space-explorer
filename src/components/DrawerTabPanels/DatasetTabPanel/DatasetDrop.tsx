import { Grid } from '@mui/material';
import React = require('react');
import Papa = require('papaparse');
import type { Dataset } from '../../..';
import { CSVLoader } from '../../Utility/Loaders/CSVLoader';
import { JSONLoader } from '../../Utility/Loaders/JSONLoader';
import { DragAndDrop } from './DragAndDrop';

export function DatasetDrop({ onChange }: { onChange(dataset: Dataset): void }) {
  return (
    <Grid container item alignItems="stretch" justifyContent="center" direction="column" style={{ padding: '16px' }}>
      <DragAndDrop
        accept=".csv,.json,.sdf"
        handleDrop={(files) => {
          if (files == null || files.length <= 0) {
            return;
          }

          const file = files[0];
          const fileName = file.name as string;

          if (fileName.endsWith('.csv')) {
            const rows = [];
            let header = null;

            Papa.parse(file, {
              // @ts-ignore
              worker: true,
              skipEmptyLines: true,
              step(results: any) {
                if (!header) {
                  header = results.data;

                  return;
                }

                const dict = {};
                results.data.forEach((value, i) => {
                  dict[header[i]] = value;
                });

                rows.push(dict);
              },
              complete() {
                new CSVLoader().resolveVectors(rows, onChange);
              },
            });
          } else {
            const reader = new FileReader();

            reader.onload = (event) => {
              const content = event.target.result;

              if (fileName.endsWith('json')) {
                new JSONLoader().resolveContent(content, onChange);
              }
            };

            reader.readAsText(file);
          }
        }}
      >
        <div style={{ height: 200 }} />
      </DragAndDrop>
    </Grid>
  );
}
