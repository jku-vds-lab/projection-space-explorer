import { ICluster } from "../../model/Cluster";
import { RenderingContextEx } from "../Utility/RenderingContextEx";
import { Tool } from "./Tool";
export declare class ClusterDragTool implements Tool {
    cluster: ICluster;
    constructor(cluster: any);
    renderToContext(context: RenderingContextEx, start: any, end: any): void;
}
