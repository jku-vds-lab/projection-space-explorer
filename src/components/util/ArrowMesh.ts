import { Face } from "@material-ui/icons"
import { Face3, Vector3 } from "three"
import THREE = require("three")

export class ArrowGeometry extends THREE.Geometry  {
    constructor(length: number, thickness: number) {
        super()

        let marker = 10

        this.vertices.push(new Vector3(-length / 2, thickness / 2, 0))
        this.vertices.push(new Vector3(-length / 2, -thickness / 2, 0))
        this.vertices.push(new Vector3(length / 2, thickness / 2, 0))
        this.vertices.push(new Vector3(length / 2, -thickness / 2, 0))

        this.faces.push(new Face3(0, 1, 2))
        this.faces.push(new Face3(0, 1, 3))


    }


    updateSize(length: number, thickness: number, zoom: number) {
        let marker = 10

        this.vertices.splice(0, this.vertices.length)
        this.faces.splice(0, this.faces.length)

        this.vertices.push(new Vector3(-length / 2 * zoom, thickness / 2, 0))
        this.vertices.push(new Vector3(-length / 2 * zoom, -thickness / 2, 0))
        this.vertices.push(new Vector3(length / 2 * zoom, thickness / 2, 0))
        this.vertices.push(new Vector3(length / 2 * zoom, -thickness / 2, 0))

        this.faces.push(new Face3(0, 1, 2))
        this.faces.push(new Face3(0, 1, 3))
    }
}