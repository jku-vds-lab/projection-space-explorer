// @ts-ignore
import tsneWorker from 'worker-loader?inline=no-fallback!../../workers/embeddings/tsne.worker';
import { Dataset, ADataset } from '../../../model/Dataset';
import { EmbeddingController } from './EmbeddingController';

import { IBaseProjection } from '../../../model/ProjectionInterfaces';

export class TSNEEmbeddingController extends EmbeddingController {
  init(dataset: Dataset, selection: any, params: any, workspace: IBaseProjection) {
    // this.worker = new Worker(new URL('../../workers/embeddings/tsne.worker', import.meta.url));
    // eslint-disable-next-line new-cap
    this.worker = new tsneWorker();

    const tensor = ADataset.asTensor(
      dataset,
      selection.filter((e) => e.checked),
      params.encodingMethod,
      params.normalizationMethod,
    ); // for gower, we don't need one-hot-encoding
    this.worker.postMessage({
      messageType: 'init',
      input: tensor.tensor,
      seed: dataset.vectors.map((vec, i) => [workspace[i].x, workspace[i].y]),
      params,
      featureTypes: tensor.featureTypes,
    });

    this.worker.addEventListener(
      'message',
      (e) => {
        const Y = e.data;
        this.stepper(Y);
        this.notifier();
      },
      false,
    );

    this.worker.addEventListener('error', (e) => {
      if (this.error) {
        this.error(e);
      }
    });
  }

  override step() {
    this.worker.postMessage({
      messageType: 'step',
    });
  }
}
