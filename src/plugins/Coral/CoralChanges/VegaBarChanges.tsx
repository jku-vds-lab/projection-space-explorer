
import React = require('react');
import {createClassFromSpec, VisualizationSpec} from 'react-vega';
import {VegaLite } from 'react-vega'
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "width": 100,
  "transform": [
    {"calculate": "abs(datum.difference)", "as": "abs"},
    {
      "window": [{
        "op": "rank",
        "as": "rank"
      }],
      "sort": [{ "field": "abs", "order": "descending" }]
    }
  ],

  "encoding": {
    "x": {
      "field": "difference",
      "type": "quantitative",
      "scale": {"domain": [-1, 1]},
      "axis": {"format": ",%", "title": "", "grid": false}
    },
    "y": {"field": "category", "type": "ordinal", "sort": {"field": "datum.abs"}, "axis": {"title": null, "labelLimit": 50, "orient": "right", "ticks": false}},
    "text": {"field": "category", "type": "nominal"},
    "color": {
      "condition": {
        "test": "indexof(['null', 'undefined', 'unknown', 'none', 'Null', 'Undefined', 'Unknown', 'None', 'NULL', 'UNDEFINED', 'UNKNOWN', 'NONE'], datum.category) >= 0 || datum.category === null",
        "value": "#aaaaaa"
      },
      "value": "#007dad",
      "legend": null
    }
  },
  
  "layer": [
    {
      "mark": {"type": "bar", "tooltip": true},
      "height": {"step": 10},
    }
  ],
  "config": {
    "view": {"strokeWidth": 0},
    "axisY": {"domainColor": "white"},
    "axisX": {"domainColor": "#ddd", "tickColor": "#ddd"}
  },
  data: { name: 'values' }
}


export default function(props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec}></VegaLite>
}

//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour

