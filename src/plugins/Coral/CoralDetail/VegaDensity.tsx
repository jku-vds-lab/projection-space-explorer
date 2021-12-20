




import React = require('react');
import {createClassFromSpec, VisualizationSpec} from 'react-vega';
import {VegaLite } from 'react-vega'
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "width": 50,
  "height": 50,
  "transform": [{"density": "feature", "groupby": ["selection"], "bandwidth": 0.3, "steps": 15}],
  "mark": {"type": "area", "tooltip": true},
  "encoding": {
    "x": {"field": "value", "title": "feature", "type": "quantitative",
      "axis": null},
    "y": {"field": "density", "type": "quantitative",
      "axis": null},
    "color": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["#aaaaaa", "#007dad"]}},
    "fillOpacity": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["0", "1.0"]}},
    "stroke": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["#000000", "#007dad"]}},
  },
  data: { name: 'values' }
}


export default function(props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec}></VegaLite>
}


//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour