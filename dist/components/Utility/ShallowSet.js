"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilityFunctions_1 = require("../WebGLView/UtilityFunctions");
/**
 * Custom set implementation that can handle array types as well
 */
class ShallowSet {
    constructor(values) {
        this.values = [];
        values.forEach(element => {
            this.add(element);
        });
    }
    has(value) {
        if (value instanceof Array) {
            return this.values.find(e => UtilityFunctions_1.arraysEqual(e, value));
        }
        else {
            return this.values.includes(value);
        }
    }
    add(value) {
        if (this.has(value)) {
            return;
        }
        this.values.push(value);
    }
    get(index) {
        return this.values[index];
    }
    indexOf(value) {
        if (value instanceof Array) {
            return this.values.findIndex(e => UtilityFunctions_1.arraysEqual(e, value));
        }
        else {
            return this.values.indexOf(value);
        }
    }
    map(callbackfn) {
        return this.values.map(callbackfn);
    }
    filter(callbackfn) {
        return this.values.filter(callbackfn);
    }
}
exports.ShallowSet = ShallowSet;
