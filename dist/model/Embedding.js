"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper class that holds 1 full embedding of a selection of vectors.
 */
class Embedding {
    constructor(vectors, name) {
        this.positions = new Array(vectors.length);
        this.name = name;
        this.hash = Math.random().toString(36).substring(7);
        vectors.forEach((vec, i) => {
            this.positions[i] = {
                x: vec.x,
                y: vec.y,
                meshIndex: vec.__meta__.meshIndex
            };
        });
    }
}
exports.Embedding = Embedding;
