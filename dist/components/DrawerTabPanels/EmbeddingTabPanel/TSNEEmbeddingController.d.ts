import { Dataset } from '../../../model/Dataset';
import { EmbeddingController } from './EmbeddingController';
import { IBaseProjection } from '../../../model/ProjectionInterfaces';
export declare class TSNEEmbeddingController extends EmbeddingController {
    init(dataset: Dataset, selection: any, params: any, workspace: IBaseProjection): void;
    step(): void;
}
//# sourceMappingURL=TSNEEmbeddingController.d.ts.map