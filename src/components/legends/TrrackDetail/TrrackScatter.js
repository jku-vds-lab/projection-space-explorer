import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('TrrackScatter', {
  "width": 100,
  "height": 100,
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "x",
      "type": "quantitative",
      "axis": null
    },
    "y": {
      "field": "y",
      "type": "quantitative",
      "axis": null},
      "opacity":{"value": 0.15}
    }
});