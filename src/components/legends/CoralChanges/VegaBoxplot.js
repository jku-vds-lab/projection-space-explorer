import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BoxplotChanges', {
    "width": 100,
    "mark": {
      "type": "boxplot",
      "extent": "min-max"
    },
    "encoding": {
      "y": {"field": "selection", "type": "nominal", "axis": null},
      "x": {
        "field": "val",
        "type": "quantitative",
        "scale": {"zero": false},
        "axis": {"title": null, "grid": false}
      },
      "color": {"field": "selection", "type": "nominal", "legend": null}
    },
    "config": {
      "view": {"stroke": 0}
    }
  }
);