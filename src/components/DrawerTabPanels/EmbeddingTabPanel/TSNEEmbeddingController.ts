import { Dataset, DatasetUtil } from "../../../model/Dataset";
import { EmbeddingController } from "./EmbeddingController"

import TsneWorker from "../../workers/embeddings/tsne.worker";

export class TSNEEmbeddingController extends EmbeddingController { 
    
    
    init(dataset: Dataset, selection: any, params: any) {
        this.worker = new TsneWorker()
        this.worker.postMessage({
            messageType: 'init',
            input: DatasetUtil.asTensor(dataset, selection.filter(e => e.checked)),
            seed: dataset.vectors.map(sample => [sample.x, sample.y]),
            params: params
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