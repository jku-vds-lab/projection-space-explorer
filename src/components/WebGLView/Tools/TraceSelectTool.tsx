import { ClusterObject, ICluster } from "../../Utility/Data/Cluster";
import { Dataset } from "../../Utility/Data/Dataset";
import { RenderingContextEx } from "../../Utility/RenderingContextEx";
import { CameraTransformations } from "../CameraTransformations";
import { Tool } from "./Tool";

export class TraceSelectTool implements Tool {
    dataset: Dataset
    cluster: ICluster
    viewTransform: any
    mousePosition: { x: number, y: number }

    constructor(dataset: Dataset, cluster: ICluster) {
        this.dataset = dataset
        this.cluster = cluster
    }

    renderToContext(context: RenderingContextEx) {
        if (!this.cluster || !this.viewTransform) {
            return;
        }
        let start = CameraTransformations.worldToScreen(ClusterObject.getCenter(this.dataset, this.cluster), this.viewTransform)

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