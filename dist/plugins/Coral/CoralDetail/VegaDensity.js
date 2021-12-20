"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_vega_1 = require("react-vega");
exports.default = react_vega_1.createClassFromLiteSpec('VegaDensity', {
    "width": 50,
    "height": 50,
    "transform": [{ "density": "feature", "groupby": ["selection"], "bandwidth": 0.3, "steps": 15 }],
    "mark": { "type": "area", "tooltip": true },
    "encoding": {
        "x": { "field": "value", "title": "feature", "type": "quantitative",
            "axis": null },
        "y": { "field": "density", "type": "quantitative",
            "axis": null },
        "color": { "field": "selection", "type": "nominal", "legend": null, "scale": { "range": ["#aaaaaa", "#007dad"] } },
        "fillOpacity": { "field": "selection", "type": "nominal", "legend": null, "scale": { "range": ["0", "1.0"] } },
        "stroke": { "field": "selection", "type": "nominal", "legend": null, "scale": { "range": ["#000000", "#007dad"] } },
    }
});
