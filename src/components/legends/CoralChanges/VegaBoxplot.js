import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BoxplotChanges', {
    "height": 100,
    "width": 250,
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
        "axis": {"title": null}
      },
      "color": {"field": "selection", "type": "nominal", "legend": null}
    }
  }
);