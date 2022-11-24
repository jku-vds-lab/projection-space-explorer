import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { TrrackLegend } from './TrrackDetail/TrrackDetail';
import { Dataset } from '../../model/Dataset';

export class GoPlugin extends PSEPlugin {
  type = DatasetType.Trrack;

  createFingerprint(dataset: Dataset, vectors: IVector[], scale = 1, aggregate: boolean): JSX.Element {
    return <TrrackLegend selection={vectors} aggregate={aggregate} />;
  }
}
