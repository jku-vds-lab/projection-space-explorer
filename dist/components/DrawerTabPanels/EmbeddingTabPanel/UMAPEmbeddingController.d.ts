import { Dataset } from "../../../model/Dataset";
import { EmbeddingController } from "./EmbeddingController";
import { IBaseProjection } from "../../../model/Projection";
export declare class UMAPEmbeddingController extends EmbeddingController {
    targetBounds: any;
    init(dataset: Dataset, selection: any, params: any, workspace: IBaseProjection): void;
    step(): void;
}
