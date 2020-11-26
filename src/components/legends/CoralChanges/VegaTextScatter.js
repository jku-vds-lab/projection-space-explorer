import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('TextChanges', {
  "height": 100,
  "width": 250,
  "transform": [
    { "filter": "datum.rank < 5" }
  ],
  "layer": [
    {
      "mark": {"type": "point", "tooltip": true},
      "encoding": {
        "x": {
          "field": "difference",
          "type": "quantitative",
          "scale": {"domain": [-1.25, 1.25]},
          "axis": {"title": null}
        },
        "y": {"field": "rank", "type": "ordinal", "axis": null},
        "text": {"field": "category", "type": "nominal"}
      }
    },
    {
      "mark": {"type": "text", "tooltip": true, "align": "center", "dy": -10},
      "encoding": {
        "x": {
          "field": "difference",
          "type": "quantitative",
          "scale": {"domain": [-1.25, 1.25]},
          "axis": {"title": null}
        },
        "y": {"field": "rank", "type": "ordinal", "axis": null},
        "text": {"field": "category", "type": "nominal"}
      }
    }
  ] 
}
);