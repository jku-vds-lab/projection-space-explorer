import { Dataset } from "../../../util/datasetselector"
import { EmbeddingController } from "./EmbeddingController"

export class UMAPEmbeddingController extends EmbeddingController {
    
    stepper: any

    notifier: any
    
    init(dataset: Dataset, selection: any, params: any) {
        this.worker = new Worker('dist/umap.js')
        this.worker.postMessage({
            messageType: 'init',
            input: dataset.asTensor(selection.filter(e => e.checked)),
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