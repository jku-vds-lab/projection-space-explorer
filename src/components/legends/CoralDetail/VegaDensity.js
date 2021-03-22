import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('VegaDensity', {
  "width": 50,
  "height": 50,
  "transform": [{"density": "feature", "groupby": ["selection"], "bandwidth": 0.3, "steps": 15}],
  "mark": {"type": "area", "tooltip": true},
  "encoding": {
    "x": {"field": "value", "title": "feature", "type": "quantitative",
      "axis": null},
    "y": {"field": "density", "type": "quantitative",
      "axis": null},
    "color": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["#aaaaaa", "#4c78a8"]}},
    "fillOpacity": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["0", "1.0"]}},
    "stroke": {"field": "selection", "type": "nominal", "legend": null, "scale": {"range": ["#000000", "#4c78a8"]}},
  }
});
