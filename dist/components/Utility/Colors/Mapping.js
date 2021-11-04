"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContinuosScale_1 = require("./ContinuosScale");
class Mapping {
    constructor(scale) {
        this.scale = scale;
    }
}
exports.Mapping = Mapping;
class DiscreteMapping extends Mapping {
    constructor(scale, values) {
        super(scale);
        this.values = values;
    }
    index(value) {
        return this.values.indexOf(value);
    }
    map(value) {
        return ContinuosScale_1.ScaleUtil.mapScale(this.scale, this.values.indexOf(value) % this.scale.stops.length);
    }
}
exports.DiscreteMapping = DiscreteMapping;
class ContinuousMapping extends Mapping {
    constructor(scale, range) {
        super(scale);
        this.range = range;
    }
    map(value) {
        if (this.range.max == this.range.min) {
            return this.scale.map(0);
        }
        var normalized = (value - this.range.min) / (this.range.max - this.range.min);
        return ContinuosScale_1.ScaleUtil.mapScale(this.scale, normalized);
    }
}
exports.ContinuousMapping = ContinuousMapping;
