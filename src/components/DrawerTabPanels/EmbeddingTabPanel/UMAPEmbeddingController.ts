import { IVector } from "../../../model/Vector"
import { Dataset, ADataset } from "../../../model/Dataset"
import { EmbeddingController } from "./EmbeddingController"

import umapWorker from "../../workers/embeddings/umap.worker";
import { IBaseProjection } from "../../../model/Projection";

export class UMAPEmbeddingController extends EmbeddingController {
    targetBounds: any
    
    init(dataset: Dataset, selection: any, params: any, workspace: IBaseProjection) {
        this.worker = new umapWorker()
        var tensor = ADataset.asTensor(dataset, selection.filter(e => e.checked), params.encodingMethod, params.normalizationMethod)
        this.worker.postMessage({
            messageType: 'init',
            input: tensor.tensor,
            seed: dataset.vectors.map((vec, i) => [workspace[i].x, workspace[i].y]),
            params: params,
            featureTypes: tensor.featureTypes
        })

        this.worker.addEventListener('message', (e) => {
            var Y = e.data
            this.stepper(Y)
            this.notifier()
        }, false);
    }

    step() {
        this.worker.postMessage({
            messageType: 'step'
        })
    }
}