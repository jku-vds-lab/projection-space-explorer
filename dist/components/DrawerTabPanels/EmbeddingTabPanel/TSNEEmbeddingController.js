"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dataset_1 = require("../../../model/Dataset");
const EmbeddingController_1 = require("./EmbeddingController");
const tsne_worker_1 = require("../../workers/embeddings/tsne.worker");
class TSNEEmbeddingController extends EmbeddingController_1.EmbeddingController {
    init(dataset, selection, params) {
        this.worker = new tsne_worker_1.default();
        this.worker.postMessage({
            messageType: 'init',
            input: Dataset_1.DatasetUtil.asTensor(dataset, selection.filter(e => e.checked)),
            seed: dataset.vectors.map(sample => [sample.x, sample.y]),
            params: params
        });
        this.worker.addEventListener('message', (e) => {
            var Y = e.data;
            this.stepper(Y);
            this.notifier();
        }, false);
    }
    step() {
        this.worker.postMessage({
            messageType: 'step'
        });
    }
}
exports.TSNEEmbeddingController = TSNEEmbeddingController;
