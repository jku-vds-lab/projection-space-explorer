/**
 * Helper class for cases where cross interaction could occur, one example would be that in the storytelling
 * the other lines should be grayed out, but a selection should overwrite this. This is solved by having 'layers'
 * of boolean values, each for one feature (1 layer for selection, 1 layer for storytelling) and solving the
 * actual value by the layer hierarchy.
 */
export declare class LayeringSystem {
    layers: Layer[];
    layerSize: number;
    layerDictionary: {
        [index: number]: number;
    };
    constructor(layerSize: number);
    clearLayer(layer: number, value: boolean): void;
    setLayerActive(layer: number, active: boolean): void;
    registerLayer(layer: number, active: boolean): void;
    setValue(index: number, layer: number, value: boolean): void;
    getValue(index: number): boolean;
}
declare class Layer {
    values: boolean[];
    active: boolean;
    constructor(size: number, active: boolean);
    setValue(index: number, value: boolean): void;
    getValue(index: number): boolean;
}
export {};
