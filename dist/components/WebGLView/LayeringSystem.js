"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper class for cases where cross interaction could occur, one example would be that in the storytelling
 * the other lines should be grayed out, but a selection should overwrite this. This is solved by having 'layers'
 * of boolean values, each for one feature (1 layer for selection, 1 layer for storytelling) and solving the
 * actual value by the layer hierarchy.
 */
class LayeringSystem {
    constructor(layerSize) {
        this.layers = [];
        this.layerDictionary = {};
        this.layerSize = layerSize;
    }
    clearLayer(layer, value) {
        let e = this.layers[this.layerDictionary[layer]];
        for (let i = 0; i < this.layerSize; i++) {
            e.setValue(i, value);
        }
    }
    setLayerActive(layer, active) {
        this.layers[this.layerDictionary[layer]].active = active;
    }
    registerLayer(layer, active) {
        let i = this.layers.push(new Layer(this.layerSize, active)) - 1;
        this.layerDictionary[layer] = i;
    }
    setValue(index, layer, value) {
        let layerIndex = this.layerDictionary[layer];
        this.layers[layerIndex].setValue(index, value);
    }
    getValue(index) {
        let activeLayerIndex = this.layerDictionary[Object.keys(this.layerDictionary).sort((a, b) => Number.parseInt(b) - Number.parseInt(a)).find(key => this.layers[this.layerDictionary[key]].active)];
        //console.log(activeLayerIndex)
        if (activeLayerIndex == undefined || activeLayerIndex < 0) {
            return false;
        }
        return this.layers[activeLayerIndex].getValue(index);
    }
}
exports.LayeringSystem = LayeringSystem;
class Layer {
    constructor(size, active) {
        this.values = new Array(size).fill(false);
        this.active = active;
    }
    setValue(index, value) {
        this.values[index] = value;
    }
    getValue(index) {
        return this.values[index];
    }
}
