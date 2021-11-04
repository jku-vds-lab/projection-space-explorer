"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QualitativeScaleMapping {
    constructor(scale, values) {
        this.scale = scale;
        this.values = values;
    }
    getMapping() {
        return this.values.reduce((map, value) => {
            map[value] = this.scale.map(this.values.indexOf(value));
            return map;
        }, {});
    }
    map(value) {
        return this.scale.map(this.values.indexOf(value));
    }
}
exports.QualitativeScaleMapping = QualitativeScaleMapping;
