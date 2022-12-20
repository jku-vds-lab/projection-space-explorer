import * as React from 'react';
import { VisualizationSpec, VegaLite } from 'react-vega';
import { VegaLiteProps } from 'react-vega/lib/VegaLite';

const spec: VisualizationSpec = {
  "width": 50,
  "height": 50,
  "transform": [
    {"filter": "datum.id < 10"}
  ],
  "layer": [
    {
      "transform": [{
        "filter": "datum.selection == 'selected'"
      }],
      "mark": {"type": "bar", "tooltip": true},
      "encoding": {
        "x": {
          "field": "category",
          "type": "ordinal",
          "axis": null,
          "sort": {"field": "id", "order": "ascending"}
        },
        "y": {
          "field": "count",
          "type": "quantitative",
          "axis": null,
          "stack": null
        },
        "color": {
          "condition": {
            "test": "indexof(['null', 'undefined', 'unknown', 'none', 'Null', 'Undefined', 'Unknown', 'None', 'NULL', 'UNDEFINED', 'UNKNOWN', 'NONE'], datum.category) >= 0 || datum.category === null",
            "value": "#aaaaaa"
          },
          "value": "#007dad"
        }
      }
    },
    {
      "transform": [{
        "filter": "datum.selection == 'all'"
      }],
      "mark": {"type": "bar", "tooltip": true, "stroke": "black", "fillOpacity": 0},
      "encoding": {
        "x": {
          "field": "category",
          "type": "ordinal",
          "axis": null,
          "sort": {"field": "id", "order": "ascending"}
        },
        "y": {
          "field": "count",
          "type": "quantitative",
          "axis": null,
          "stack": null
        },
        "color": {
          "condition": {
            "test": "indexof(['null', 'undefined', 'unknown', 'none', 'Null', 'Undefined', 'Unknown', 'None', 'NULL', 'UNDEFINED', 'UNKNOWN', 'NONE'], datum.category) >= 0 || datum.category === null",
            "value": "#aaaaaa"
          },
        }
      }
    }
  ],
  data: { name: 'values' },
};

export default function (props: Omit<VegaLiteProps, 'spec'>) {
  return <VegaLite {...props} spec={spec} />;
}

// , "scale": {"domain": [0, 1]}
// rank != 1 and switching color scale range would be a workaround to make sure when there is only 1 datapoint it has the rank 1 colour
