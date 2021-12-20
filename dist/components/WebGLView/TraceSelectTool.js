"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cluster_1 = require("../../model/Cluster");
const CameraTransformations_1 = require("./CameraTransformations");
class TraceSelectTool {
    constructor(dataset, cluster) {
        this.dataset = dataset;
        this.cluster = cluster;
    }
    renderToContext(context) {
        if (!this.cluster || !this.viewTransform) {
            return;
        }
        let start = CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(this.dataset, this.cluster), this.viewTransform);
        context.lineWidth = "2";
        context.beginPath();
        context.arc(start.x, start.y, 16, 0, 2 * Math.PI, false);
        context.stroke();
        context.strokeStyle = "red";
        context.beginPath();
        context.arc(this.mousePosition.x, this.mousePosition.y, 21, 0, 2 * Math.PI, false);
        context.stroke();
    }
}
exports.TraceSelectTool = TraceSelectTool;
