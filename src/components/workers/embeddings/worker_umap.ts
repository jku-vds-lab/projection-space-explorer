import { UMAP } from '../../Utility/UMAP';
import "regenerator-runtime/runtime";
import { euclidean, get_distance_fn, jaccard } from '../../Utility/Distances/distance_functions';

/**
 * Worker thread that computes a stepwise projection
 */
self.addEventListener('message', function (e) {
    let context = self as any
    if (e.data.messageType == 'init') {
        context.raw = e.data
        context.umap = new UMAP({
            nNeighbors: e.data.params.nNeighbors,
            distanceFn: get_distance_fn(e.data.params.distanceMetric, e)
        })
        context.umap.initializeFit(e.data.input, e.data.params.seeded ? e.data.seed : undefined)
        context.umap.step()

        context.postMessage(context.umap.getEmbedding())
    } else {
        context.umap.step()
        context.postMessage(context.umap.getEmbedding())
    }
}, false);