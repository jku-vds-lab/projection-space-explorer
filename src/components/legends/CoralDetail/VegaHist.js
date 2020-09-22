import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('VegaHist', {
  "width": 50,
  "height": 50,
  "mark": "bar",
  "transform": [{"filter": "datum.feature != null"}],
  "encoding": {
    "x": {
      "bin": true,
      "field": "feature",
      "axis": {"title": null}
    },
    "y": {
      "aggregate": "count",
      "axis": {"title": null}
    }
  }
});