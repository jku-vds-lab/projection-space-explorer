import { Dataset } from "../../../Utility/Data/Dataset";
import { EmbeddingController } from "./EmbeddingController"

import * as frontend_utils from "../../../../utils/frontend-connect";

export class TSNEEmbeddingController extends EmbeddingController { 
    
    
    init(dataset: Dataset, selection: any, params: any) {
        this.worker = new Worker(frontend_utils.BASE_PATH + 'tsne.js') //dist/
        var tensor = dataset.asTensor(selection.filter(e => e.checked), null, params.distanceMetric!=="gower") // for gower, we don't need one-hot-encoding
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