import { Dataset } from "../../../Utility/Data/Dataset";
import { EmbeddingController } from "./EmbeddingController"

import * as frontend_utils from "../../../../utils/frontend-connect";

export class TSNEEmbeddingController extends EmbeddingController { 
    
    
    init(dataset: Dataset, selection: any, params: any) {
        this.worker = new Worker(frontend_utils.BASE_PATH + 'tsne.js') //dist/
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