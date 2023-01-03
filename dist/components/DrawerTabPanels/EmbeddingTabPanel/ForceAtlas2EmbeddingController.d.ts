import { DataLine } from '../../../model/DataLine';
import { Dataset } from '../../../model/Dataset';
import { EmbeddingController } from './EmbeddingController';
export declare class ForceAtlas2EmbeddingController extends EmbeddingController {
    nodes: any;
    buildGraph(segments: DataLine[]): any[][];
    init(dataset: Dataset, selection: any, params: any): void;
    step(): void;
}
//# sourceMappingURL=ForceAtlas2EmbeddingController.d.ts.map