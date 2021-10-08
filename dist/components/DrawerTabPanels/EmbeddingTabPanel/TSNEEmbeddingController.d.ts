import { Dataset } from "../../../model/Dataset";
import { EmbeddingController } from "./EmbeddingController";
export declare class TSNEEmbeddingController extends EmbeddingController {
    init(dataset: Dataset, selection: any, params: any): void;
    step(): void;
}
