import Cluster from "../../Utility/Data/Cluster";
import { RenderingContextEx } from "../../Utility/RenderingContextEx";
import { CameraTransformations } from "../CameraTransformations";
import { Tool } from "./Tool";

export class TraceSelectTool implements Tool {
    cluster: Cluster
    viewTransform: any
    mousePosition: { x: number, y: number }

    constructor(cluster: Cluster) {
        this.cluster = cluster
    }

    renderToContext(context: RenderingContextEx) {
        if (!this.cluster || !this.viewTransform) {
            return;
        }
        let start = CameraTransformations.worldToScreen(this.cluster.getCenter(), this.viewTransform)

        context.lineWidth = "2"


        context.beginPath()
        context.arc(start.x, start.y, 16, 0, 2 * Math.PI, false)
        context.stroke()

        context.strokeStyle = "red"
        context.beginPath()
        context.arc(this.mousePosition.x, this.mousePosition.y, 21, 0, 2 * Math.PI, false)
        context.stroke()
    }
}