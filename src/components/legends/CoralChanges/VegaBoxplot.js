import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BoxplotChanges', {
    "width": 100,
    "mark": {
      "type": "boxplot",
      "extent": "min-max",
      "median": {"color": "black"}
    },
    "encoding": {
      "y": {"field": "selection", "type": "nominal", "axis": null},
      "x": {
        "field": "val",
        "type": "quantitative",
        "scale": {"zero": false},
        "axis": {"title": null, "grid": false}
      },
      "color": {
        "value": "#007dad"
      }
    },
    "config": {
      "view": {"stroke": 0}
    }
  }
);