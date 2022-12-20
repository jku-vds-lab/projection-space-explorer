import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { GoLegend } from './GoLegend';
import { Dataset } from '../../model/Dataset';

export class GoPlugin extends PSEPlugin {
  type = DatasetType.Go;

  createFingerprint(dataset: Dataset, vectors: IVector[], scale = 1, aggregate: boolean): JSX.Element {
    return <GoLegend selection={vectors} aggregate={aggregate} />;
  }
}
