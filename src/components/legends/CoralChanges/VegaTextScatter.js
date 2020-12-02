import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('TextChanges', {
  "width": 100,
  "transform": [
    {"calculate": "abs(datum.difference)", "as": "abs"},
    {"filter": "datum.abs > threshold.abs"},
    {
      "window": [{
        "op": "rank",
        "as": "rank"
      }],
      "sort": [{ "field": "abs", "order": "descending" }]
    },
    {"calculate": "datum.rank==1", "as": "color"}
  ],

  "encoding": {
    "x": {
      "field": "difference",
      "type": "quantitative",
      "scale": {"domain": [-1, 1]},
      "axis": {"format": ",%", "title": false, "grid": false}
    },
    "y": {"field": "category", "type": "ordinal", "sort": {"field": "datum.abs"}, "axis": {"title": null, "labelLimit": 50, "orient": "right", "ticks": false}},
    "text": {"field": "category", "type": "nominal"},
    "color": {
      "condition": {
        "test": "indexof(['null', 'undefined', 'unknown', 'none', 'Null', 'Undefined', 'Unknown', 'None', 'NULL', 'UNDEFINED', 'UNKNOWN', 'NONE'], datum.category) >= 0 || datum.category === null",
        "value": "#aaaaaa"
      },
      "field": "color",
      "scale": {"range": ["#4c78a8", "#000088"]},
      "legend": null
    }
  },
  
  "layer": [
    {
      "selection": {
        "threshold": {
          "type": "single", "fields": ["abs"],
          "init": {"abs": 0.25},
          "bind": {
            "abs": {"input": "range", "min": 0,"max": 1,"step": 0.01, "name": "dif"}
          }
        }
      },
      "mark": {"type": "bar", "tooltip": true}
    }
  ],
  "config": {
    "view": {"stroke": 0},
    "axisY": {"domainColor": "white"},
    "axisX": {"domainColor": "#ddd", "tickColor": "#ddd"}
  }
}
);