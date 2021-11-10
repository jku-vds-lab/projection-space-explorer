import React = require('react');
import {createClassFromSpec, VisualizationSpec} from 'react-vega';
import {VegaLite } from 'react-vega'
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "width": 50,
  "height": 50,
  "transform": [
    {
      "window": [{
        "op": "row_number",
        "as": "rank"
      }],
      "sort": [{ "field": "count", "order": "descending" }]
    }, {
      "filter": "datum.rank <= 5"
    }
  ],
  "mark": {"type": "bar", "tooltip": true},
  "encoding": {
    "x": {"field": "category", "type": "ordinal", "axis": null, "sort": "-y"},
    "y": {"field": "count", "type": "quantitative", "axis": null},
    "color": {
      "condition": {
        "test": "indexof(['null', 'undefined', 'unknown', 'none', 'Null', 'Undefined', 'Unknown', 'None', 'NULL', 'UNDEFINED', 'UNKNOWN', 'NONE'], datum.category) >= 0 || datum.category === null",
        "value": "#aaaaaa"
      },
      "value": "#007dad",
      "legend": null
    }
  }
}


export default function(props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec}></VegaLite>
}

//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour