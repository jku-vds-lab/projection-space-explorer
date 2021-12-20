"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Intersection_1 = require("../Utility/Geometry/Intersection");
class LassoSelection {
    constructor() {
        this.intersects = (seat) => Intersection_1.pointInHull(seat, this.points);
        this.drawing = false;
        this.start = { x: 0, y: 0 };
        this.points = [];
    }
    mouseDown(alt, x, y) {
        if (!this.drawing && alt) {
            this.drawing = true;
            this.start = { x: x, y: y };
            this.points = [this.start];
        }
    }
    mouseMove(x, y) {
        if (this.drawing) {
            this.points.push({ x: x, y: y });
        }
    }
    mouseUp(x, y) {
        if (this.drawing) {
            this.points.push({
                x: x,
                y: y
            });
            this.points.push(this.start);
            this.drawing = false;
        }
    }
    selection(vectors, visible) {
        var indices = [];
        vectors.forEach((vector, index) => {
            if (visible(vector) && this.intersects(vector)) {
                indices.push(index);
            }
        });
        return indices;
    }
}
exports.LassoSelection = LassoSelection;
