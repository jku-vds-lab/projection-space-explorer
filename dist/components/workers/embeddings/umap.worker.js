"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UMAP_1 = require("../../Utility/UMAP");
require("regenerator-runtime/runtime");
const umap_1 = require("../../Utility/UMAP/umap");
/**
 * Worker thread that computes a stepwise projection
 */
self.addEventListener('message', function (e) {
    let context = self;
    if (e.data.messageType == 'init') {
        context.raw = e.data;
        context.umap = new UMAP_1.UMAP({
            nNeighbors: e.data.params.nNeighbors,
            distanceFn: e.data.params.distanceMetric == 'euclidean' ? umap_1.euclidean : umap_1.jaccard
        });
        context.umap.initializeFit(e.data.input, e.data.params.seeded ? e.data.seed : undefined);
        context.umap.step();
        context.postMessage(context.umap.getEmbedding());
    }
    else {
        context.umap.step();
        context.postMessage(context.umap.getEmbedding());
    }
}, false);
exports.default = null;
