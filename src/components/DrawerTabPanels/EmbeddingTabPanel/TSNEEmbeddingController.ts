import { Dataset, DatasetUtil } from "../../../model/Dataset";
import { EmbeddingController } from "./EmbeddingController"

import TsneWorker from "../../workers/embeddings/tsne.worker";

export class TSNEEmbeddingController extends EmbeddingController { 
    
    
    init(dataset: Dataset, selection: any, params: any) {
        this.worker = new TsneWorker()
        var tensor = DatasetUtil.asTensor(selection.filter(e => e.checked), null, params.encodingMethod, params.normalizationMethod) // for gower, we don't need one-hot-encoding
        this.worker.postMessage({
            messageType: 'init',
            input: tensor.tensor,
            seed: dataset.vectors.map(sample => [sample.x, sample.y]),
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