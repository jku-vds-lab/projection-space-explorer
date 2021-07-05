import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('TrrackScatter', {
  "width": 200,
  "height": 200,
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "x",
      "type": "quantitative",
      // "axis": null
      "scale": {"domain": [0, 1]},
      "axis": false
    },
    "y": {
      "field": "y",
      "type": "quantitative",
      // "axis": null
      "scale": {"domain": [0, 1]},
      "axis": false},
      "opacity":{"value": 0.15}
    }
});