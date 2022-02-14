import React = require('react');
import { createClassFromSpec, VisualizationSpec, VegaLite } from 'react-vega';
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  width: 200,
  height: 200,
  mark: 'circle',
  encoding: {
    x: {
      field: 'x',
      type: 'quantitative',
      scale: { domain: [0, 1] },
      axis: {},
    },
    y: {
      field: 'y',
      type: 'quantitative',
      scale: {
        domain: [0, 1],
      },
      axis: {},
    },
    opacity: { value: 0.15 },
  },
  data: { name: 'values' },
};

export default function (props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec} />;
}
