import { Vect } from "../Utility/Data/Vect"
import * as libtess from 'libtess'
import * as THREE from 'three'










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

    intersects(seat) {
        if (this.points.length <= 1) {
            return false;
        }

        var selected = false

        var intercessionCount = 0;
        for (var index = 1; index < this.points.length; index++) {
            var start = this.points[index - 1];
            var end = this.points[index];
            var line = { start: start, end: end };

            //Testes

            //*************************************************
            //* Adicionar teste bounding box intersection aqui *
            //*************************************************

            var ray = { Start: { x: seat.x, y: seat.y }, End: { x: 99999, y: 0 } };
            var segment = { Start: start, End: end };
            var rayDistance = {
                x: ray.End.x - ray.Start.x,
                y: ray.End.y - ray.Start.y
            };
            var segDistance = {
                x: segment.End.x - segment.Start.x,
                y: segment.End.y - segment.Start.y
            };

            var rayLength = Math.sqrt(Math.pow(rayDistance.x, 2) + Math.pow(rayDistance.y, 2));
            var segLength = Math.sqrt(Math.pow(segDistance.x, 2) + Math.pow(segDistance.y, 2));

            if ((rayDistance.x / rayLength == segDistance.x / segLength) &&
                (rayDistance.y / rayLength == segDistance.y / segLength)) {
                continue;
            }

            var T2 = (rayDistance.x * (segment.Start.y - ray.Start.y) + rayDistance.y * (ray.Start.x - segment.Start.x)) / (segDistance.x * rayDistance.y - segDistance.y * rayDistance.x);
            var T1 = (segment.Start.x + segDistance.x * T2 - ray.Start.x) / rayDistance.x;

            //Parametric check.
            if (T1 < 0) {
                continue;
            }
            if (T2 < 0 || T2 > 1) {
                continue
            };
            if (isNaN(T1)) {
                continue
            }; //rayDistance.X = 0

            intercessionCount++;
        }

        if (intercessionCount == 0) {
            selected = false;
            return selected;
        }
        if (intercessionCount & 1) {
            selected = true;
        } else {
            selected = false;
        }


        return selected
    }
}