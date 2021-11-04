"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SequentialScaleMapping {
    constructor(scale, range) {
        this.scale = scale;
        this.range = range;
    }
    map(value) {
        var normalized = (value - this.range.min) / (this.range.max - this.range.min);
        return this.scale.map(normalized);
    }
}
exports.SequentialScaleMapping = SequentialScaleMapping;
