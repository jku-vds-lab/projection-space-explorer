"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemeColor_1 = require("./SchemeColor");
const LinearColorScale_1 = require("./LinearColorScale");
const Mapping_1 = require("./Mapping");
var d3v5 = require('d3v5');
class ScaleUtil {
    static mapScale(scale, value) {
        switch (scale.type) {
            case 'discrete':
                return scale.stops[value % scale.stops.length];
            case 'continuous':
                const interpolator = d3v5.scaleLinear()
                    .domain(scale.stops.map((stop, index) => (1 / (scale.stops.length - 1)) * index)).range(scale.stops.map(stop => stop.hex));
                var d3color = d3v5.color(interpolator(value));
                return SchemeColor_1.SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
        }
    }
    static mappingFromScale(scale, attribute, dataset) {
        if (scale.type === 'discrete') {
            // Generate scale
            return new Mapping_1.DiscreteMapping(scale, [...new Set(dataset.vectors.map(vector => vector[attribute.key]))]);
        }
        if (scale.type === 'continuous') {
            var min = null, max = null;
            if (dataset.columns[attribute.key].range) {
                min = dataset.columns[attribute.key].range.min;
                max = dataset.columns[attribute.key].range.max;
            }
            else {
                var filtered = dataset.vectors.map(vector => vector[attribute.key]);
                max = Math.max(...filtered);
                min = Math.min(...filtered);
            }
            return new Mapping_1.ContinuousMapping(scale, { min: min, max: max });
        }
        return null;
    }
}
exports.ScaleUtil = ScaleUtil;
class ContinuosScale extends LinearColorScale_1.LinearColorScale {
    constructor(stops) {
        super(stops, "continuous");
    }
}
exports.ContinuosScale = ContinuosScale;
class DiscreteScale extends LinearColorScale_1.LinearColorScale {
    constructor(stops) {
        super(stops, "discrete");
    }
}
exports.DiscreteScale = DiscreteScale;
