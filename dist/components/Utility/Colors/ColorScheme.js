"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColorScheme {
    constructor(colors) {
        this.colors = colors;
    }
    getMapping() {
        return this.mapping;
    }
    map(value) {
        return this.colors[value];
    }
}
exports.ColorScheme = ColorScheme;
