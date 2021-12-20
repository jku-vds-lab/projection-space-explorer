"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_vega_1 = require("react-vega");
exports.default = react_vega_1.createClassFromLiteSpec('VegaHist', {
    "width": 50,
    "height": 50,
    "mark": { "type": "bar", "tooltip": true },
    "transform": [{ "filter": "datum.feature != null" }],
    "encoding": {
        "x": {
            "bin": {
                "maxbins": 10
            },
            "field": "feature",
            "axis": null
        },
        "y": {
            "aggregate": "count",
            "axis": null
        },
        "color": {
            "value": "#007dad"
        }
    }
});
