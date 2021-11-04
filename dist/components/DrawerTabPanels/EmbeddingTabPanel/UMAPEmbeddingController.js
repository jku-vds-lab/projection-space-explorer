"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dataset_1 = require("../../../model/Dataset");
const EmbeddingController_1 = require("./EmbeddingController");
const umap_worker_1 = require("../../workers/embeddings/umap.worker");
class UMAPEmbeddingController extends EmbeddingController_1.EmbeddingController {
    init(dataset, selection, params, samples) {
        this.worker = new umap_worker_1.default();
        this.worker.postMessage({
            messageType: 'init',
            input: Dataset_1.DatasetUtil.asTensor(dataset, selection.filter(e => e.checked), samples),
            seed: dataset.vectors.map(sample => [sample.x, sample.y]),
            params: params
        });
        this.worker.addEventListener('message', (e) => {
            var Y = e.data;
            this.stepper(Y);
            this.notifier();
        }, false);
        if (samples) {
            this.targetBounds = this.bounds(samples);
        }
    }
    boundsY(Y) {
        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        Y.forEach(sample => {
            minX = Math.min(minX, sample[0]);
            maxX = Math.max(maxX, sample[0]);
            minY = Math.min(minY, sample[1]);
            maxY = Math.max(maxY, sample[1]);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        };
    }
    bounds(samples) {
        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        samples.forEach(sample => {
            minX = Math.min(minX, sample.x);
            maxX = Math.max(maxX, sample.x);
            minY = Math.min(minY, sample.y);
            maxY = Math.max(maxY, sample.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        };
    }
    step() {
        this.worker.postMessage({
            messageType: 'step'
        });
    }
}
exports.UMAPEmbeddingController = UMAPEmbeddingController;
