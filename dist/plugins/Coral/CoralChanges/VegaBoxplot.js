"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_vega_1 = require("react-vega");
exports.default = react_vega_1.createClassFromLiteSpec('BoxplotChanges', {
    "width": 100,
    "mark": {
        "type": "boxplot",
        "extent": "min-max",
        "median": { "color": "black" }
    },
    "encoding": {
        "y": { "field": "selection", "type": "nominal", "axis": null },
        "x": {
            "field": "val",
            "type": "quantitative",
            "scale": { "zero": false },
            "axis": { "title": null, "grid": false }
        },
        "color": {
            "value": "#007dad"
        }
    },
    "config": {
        "view": { "stroke": 0 }
    }
});
