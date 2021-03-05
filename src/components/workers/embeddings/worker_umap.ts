import { UMAP } from '../../Utility/UMAP';
import "regenerator-runtime/runtime";
import { euclidean, jaccard } from '../../Utility/UMAP/umap';

/**
 * Worker thread that computes a stepwise projection
 */
self.addEventListener('message', function (e) {
    let context = self as any
    if (e.data.messageType == 'init') {
        context.raw = e.data
        context.umap = new UMAP({
            nNeighbors: e.data.params.nNeighbors,
            distanceFn: e.data.params.distanceMetric == 'euclidean' ? euclidean : jaccard
        })
        context.umap.initializeFit(e.data.input, e.data.params.seeded ? e.data.seed : undefined)
        context.umap.step()

        context.postMessage(context.umap.getEmbedding())
    } else {
        context.umap.step()
        context.postMessage(context.umap.getEmbedding())
    }
}, false);