





import React = require('react');
import { createClassFromSpec, VisualizationSpec } from 'react-vega';
import { VegaLite } from 'react-vega'
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "width": 200,
  "height": 200,
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "x",
      "type": "quantitative",
      // "axis": null
      "scale": { "domain": [0, 1] },
      "axis": {
        
      }
    },
    "y": {
      "field": "y",
      "type": "quantitative",
      // "axis": null
      "scale": {
        "domain": [0, 1]
      },
      "axis": {
        
      }
    },
    "opacity": { "value": 0.15 }
  }
}

export default function (props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec}></VegaLite>
}


//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour