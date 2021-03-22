import { arraysEqual } from "../WebGLView/UtilityFunctions"


/**
 * Custom set implementation that can handle array types as well
 */
export class ShallowSet {
    values = []

    constructor(values) {
        values.forEach(element => {
            this.add(element)
        })
    }

    has(value) {
        if (value instanceof Array) {
            return this.values.find(e => arraysEqual(e, value))
        } else {
            return this.values.includes(value)
        }
    }

    add(value) {
        if (this.has(value)) {
            return;
        }

        this.values.push(value)
    }

    get(index: number) {
        return this.values[index]
    }

    indexOf(value) {
        if (value instanceof Array) {
            return this.values.findIndex(e => arraysEqual(e, value))
        } else {
            return this.values.indexOf(value)
        }
    }

    map(callbackfn) {
        return this.values.map(callbackfn)
    }

    filter(callbackfn){
        return this.values.filter(callbackfn)
    }
}