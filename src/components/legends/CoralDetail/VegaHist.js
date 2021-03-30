import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('VegaHist', {
  "width": 50,
  "height": 50,
  "mark": {"type": "bar", "tooltip": true},
  "transform": [{"filter": "datum.feature != null"}],
  "encoding": {
    "x": {
      "bin": {
        "maxbins": 10
      },
      "field": "feature",
      "axis": null
    },
    "y": {
      "aggregate": "count",
      "axis": null
    },
    "color": {
      "value": "#007dad"
    }
  }
});