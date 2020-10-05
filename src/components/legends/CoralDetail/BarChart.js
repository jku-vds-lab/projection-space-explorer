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
    }
  ],
  "mark": {"type": "bar", "tooltip": true},
  "encoding": {
    "x": {"field": "category", "type": "ordinal", "axis": {"title": null, "labels": false}, "sort": "-y"},
    "y": {"field": "count", "type": "quantitative", "axis": {"title": null}}
  }
});
//, "scale": {"domain": [0, 1]}