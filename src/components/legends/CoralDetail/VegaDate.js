import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('VegaDate', {
  "width": 50,
  "height": 50,
  "mark": {"type": "bar", "tooltip": true},
  "transform": [{"filter": "datum.feature != null"}],
  "encoding": {
    "x": {
      "timeUnit": "yearmonth",
      "bin": true,
      "field": "feature",
      "axis": null
    },
    "y": {
      "aggregate": "count",
      "axis": null
    }
  }
});