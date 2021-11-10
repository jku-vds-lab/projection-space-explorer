


import React = require('react');
import {createClassFromSpec, VisualizationSpec} from 'react-vega';
import {VegaLite } from 'react-vega'
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "height": 100,
  "width": 250,
  "transform": [
    { "filter": "datum.rank < 5" }
  ],
  "layer": [
    {
      "mark": {"type": "point", "tooltip": true},
      "encoding": {
        "x": {
          "field": "difference",
          "type": "quantitative",
          "scale": {"domain": [-1.25, 1.25]},
          "axis": {"title": null}
        },
        "y": {"field": "rank", "type": "ordinal", "axis": null},
        "text": {"field": "category", "type": "nominal"}
      }
    },
    {
      "mark": {"type": "text", "tooltip": true, "align": "center", "dy": -10},
      "encoding": {
        "x": {
          "field": "difference",
          "type": "quantitative",
          "scale": {"domain": [-1.25, 1.25]},
          "axis": {"title": null}
        },
        "y": {"field": "rank", "type": "ordinal", "axis": null},
        "text": {"field": "category", "type": "nominal"}
      }
    }
  ] 
}


export default function(props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec}></VegaLite>
}

//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour

