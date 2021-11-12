import { ICluster } from "../../model/Cluster";
import { Dataset } from "../../model/Dataset";
import { RenderingContextEx } from "../Utility/RenderingContextEx";
import { Tool } from "./Tool";
import { ViewTransformType } from "../Ducks/ViewTransformDuck";
export declare class TraceSelectTool implements Tool {
    dataset: Dataset;
    cluster: ICluster;
    viewTransform: ViewTransformType;
    mousePosition: {
        x: number;
        y: number;
    };
    constructor(dataset: Dataset, cluster: ICluster);
    renderToContext(context: RenderingContextEx): void;
}
