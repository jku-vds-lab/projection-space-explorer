import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BarChanges', {
    "width": 50,
    "height": 50,
    "transform": [
      {"calculate": "abs(datum.difference)", "as": "abs"},
      {
        "window": [{
          "op": "rank",
          "as": "rank"
        }],
        "sort": [{ "field": "abs", "order": "descending" }]
      }, {
        "filter": "datum.rank <= 5"
      }
    ],
    "mark": {"type": "bar", "tooltip": true},
    "encoding": {
      "x": {
        "field": "category", "type": "nominal",
        "sort": {"field": "abs", "order": "descending"},
        "axis": null
      },
      "y": {
        "field": "difference", "type": "quantitative",
        "axis": null
      }
    }
  }
  );