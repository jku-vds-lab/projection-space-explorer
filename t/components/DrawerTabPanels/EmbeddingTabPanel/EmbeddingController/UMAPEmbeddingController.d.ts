import { IVector } from "../../../../model/Vector";
import { Dataset } from "../../../../model/Dataset";
import { EmbeddingController } from "./EmbeddingController";
export declare class UMAPEmbeddingController extends EmbeddingController {
    targetBounds: any;
    init(dataset: Dataset, selection: any, params: any, samples?: any): void;
    boundsY(Y: any): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    bounds(samples: IVector[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    step(): void;
}
