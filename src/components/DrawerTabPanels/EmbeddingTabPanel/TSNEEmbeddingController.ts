import { Dataset, ADataset } from '../../../model/Dataset';
import { EmbeddingController } from './EmbeddingController';

import TsneWorker from '../../workers/embeddings/tsne.worker';
import { IBaseProjection } from '../../../model/ProjectionInterfaces';

export class TSNEEmbeddingController extends EmbeddingController {
  init(dataset: Dataset, selection: any, params: any, workspace: IBaseProjection) {
    this.worker = new TsneWorker();
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
  }

  step() {
    this.worker.postMessage({
      messageType: 'step',
    });
  }
}
