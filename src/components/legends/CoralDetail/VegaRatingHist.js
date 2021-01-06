import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('VegaRatingHist', {
  "width": 50,
  "height": 50,
  "mark": {"type": "bar", "tooltip": true},
  "transform": [{"filter": "datum.feature != null"}],
  "encoding": {
    "x": {
      "field": "feature",
      "axis": null,
      "scale": {"domain": [0,1,2,3,4]}
    },
    "y": {
      "aggregate": "count",
      "axis": null
    }
  }
});