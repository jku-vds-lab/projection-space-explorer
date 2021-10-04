import { ICluster } from "../../../model/Cluster";
import { Dataset } from "../../../model/Dataset";
import { RenderingContextEx } from "../../Utility/RenderingContextEx";
import { Tool } from "./Tool";
export declare class TraceSelectTool implements Tool {
    dataset: Dataset;
    cluster: ICluster;
    viewTransform: any;
    mousePosition: {
        x: number;
        y: number;
    };
    constructor(dataset: Dataset, cluster: ICluster);
    renderToContext(context: RenderingContextEx): void;
}
