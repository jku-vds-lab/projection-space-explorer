import { IVect } from "./Vect";

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
    name: string
    hash: string
    
    constructor(vectors: IVect[], name) {
        this.positions = new Array(vectors.length)
        this.name = name
        this.hash = Math.random().toString(36).substring(7)

        vectors.forEach((vec, i) => {
            this.positions[i] = {
                x: vec.x,
                y: vec.y,
                meshIndex: vec.__meta__.meshIndex
            }
        })
    }
}