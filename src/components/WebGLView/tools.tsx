import { Vect } from "../Utility/Data/Vect"
import * as libtess from 'libtess'
import * as THREE from 'three'
import { pointInHull } from "../Utility/Geometry/Intersection"










export class LassoSelection {
    drawing: boolean
    start: { x, y }
    points: { x, y }[]

    constructor() {
        this.drawing = false
        this.start = { x: 0, y: 0 }
        this.points = []
    }

    mouseDown(alt, x, y) {
        if (!this.drawing && alt) {
            this.drawing = true

            this.start = { x: x, y: y }
            this.points = [this.start]

        }
    }

    mouseMove(x, y) {
        if (this.drawing) {
            this.points.push({ x: x, y: y })

        }
    }

    mouseUp(x, y) {
        if (this.drawing) {
            this.points.push({
                x: x,
                y: y
            })

            this.points.push(this.start)

            this.drawing = false
        }
    }

    selection(vectors, visible) {
        var indices = []
        vectors.forEach((vector, index) => {
            if (visible(vector) && this.intersects(vector)) {
                indices.push(index)
            }
        })
        return indices
    }

    intersects = (seat) => pointInHull(seat, this.points)
}