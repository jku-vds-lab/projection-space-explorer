import React = require('react');
import { createClassFromSpec, VisualizationSpec, VegaLite } from 'react-vega';
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  width: 100,
  mark: {
    type: 'boxplot',
    extent: 'min-max',
    median: { color: 'black' },
  },
  encoding: {
    y: { field: 'selection', type: 'nominal', axis: null },
    x: {
      field: 'val',
      type: 'quantitative',
      scale: { zero: false },
      axis: { title: null, grid: false },
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
