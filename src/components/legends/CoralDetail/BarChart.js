import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BarChart', {
  "width": 50,
  "height": 50,
  "transform": [
    {
      "window": [{
        "op": "rank",
        "as": "rank"
      }],
      "sort": [{ "field": "count", "order": "descending" }]
    }, {
      "filter": "datum.rank <= 5"
    },
    {"calculate": "datum.rank==1", "as": "color"}
  ],
  "mark": {"type": "bar", "tooltip": true},
  "encoding": {
    "x": {"field": "category", "type": "ordinal", "axis": null, "sort": "-y"},
    "y": {"field": "count", "type": "quantitative", "axis": null},
    "color": {
      "condition": {
        "test": "datum.category === 'null' || datum.category === null",
        "value": "#aaaaaa"
      },
      "field": "color",
      "scale": {"range": ["#4c78a8", "#000088"]},
      "legend": null
    }
  }
});
//, "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour