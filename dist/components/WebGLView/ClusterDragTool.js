"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClusterDragTool {
    constructor(cluster) {
        this.cluster = cluster;
    }
    renderToContext(context, start, end) {
        context.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.4)";
        context.lineWidth = "6";
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.arrowTo(start.x, start.y, end.x, end.y, 10);
        context.stroke();
        context.closePath();
    }
}
exports.ClusterDragTool = ClusterDragTool;
