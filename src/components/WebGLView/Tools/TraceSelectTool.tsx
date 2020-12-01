import Cluster from "../../Utility/Data/Cluster";
import { RenderingContextEx } from "../../Utility/RenderingContextEx";
import { CameraTransformations } from "../CameraTransformations";
import { Tool } from "./Tool";

export class TraceSelectTool implements Tool {
    cluster: Cluster
    viewTransform: any

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
        context.moveTo(start.x, start.y)
        context.arc(start.x, start.y, 16, 0, 2 * Math.PI, false)
        context.stroke()
    }
}