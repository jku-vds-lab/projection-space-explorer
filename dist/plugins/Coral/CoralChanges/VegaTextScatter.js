"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_vega_1 = require("react-vega");
exports.default = react_vega_1.createClassFromLiteSpec('TextChanges', {
    "height": 100,
    "width": 250,
    "transform": [
        { "filter": "datum.rank < 5" }
    ],
    "layer": [
        {
            "mark": { "type": "point", "tooltip": true },
            "encoding": {
                "x": {
                    "field": "difference",
                    "type": "quantitative",
                    "scale": { "domain": [-1.25, 1.25] },
                    "axis": { "title": null }
                },
                "y": { "field": "rank", "type": "ordinal", "axis": null },
                "text": { "field": "category", "type": "nominal" }
            }
        },
        {
            "mark": { "type": "text", "tooltip": true, "align": "center", "dy": -10 },
            "encoding": {
                "x": {
                    "field": "difference",
                    "type": "quantitative",
                    "scale": { "domain": [-1.25, 1.25] },
                    "axis": { "title": null }
                },
                "y": { "field": "rank", "type": "ordinal", "axis": null },
                "text": { "field": "category", "type": "nominal" }
            }
        }
    ]
});
