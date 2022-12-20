import * as React from 'react';
import { createClassFromSpec, VisualizationSpec, VegaLite } from 'react-vega';
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  width: 50,
  height: 50,
  mark: { type: 'bar', tooltip: true },
  transform: [{ filter: 'datum.feature != null' }],
  encoding: {
    x: {
      field: 'feature',
      type: 'temporal',
      bin: {
        maxbins: 10,
      },
      axis: null,
    },
    y: {
      aggregate: 'count',
      axis: null,
    },
    color: {
      value: '#007dad',
    },
  },
  data: { name: 'values' },
};

export default function (props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec} />;
}

// , "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour
