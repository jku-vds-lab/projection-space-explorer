import { Vect } from "./Vect";

type PositionType = {
    x: number
    y: number
    meshIndex: number
}

/**
 * Helper class that holds 1 full embedding of a selection of vectors.
 */
export class Embedding {
    positions: PositionType[]
    
    constructor(vectors: Vect[]) {
        this.positions = new Array(vectors.length)

        vectors.forEach((vec, i) => {
            this.positions[i] = {
                x: vec.x,
                y: vec.y,
                meshIndex: vec.view.meshIndex
            }
        })
    }
}