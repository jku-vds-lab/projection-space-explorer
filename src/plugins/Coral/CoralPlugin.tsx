import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { CoralLegend } from './CoralDetail/CoralDetail';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { Dataset } from '../../model/Dataset';

export class CoralPlugin extends PSEPlugin {
  type = DatasetType.Cohort_Analysis;

  createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
    return <CoralLegend selection={vectors} aggregate={aggregate} />;
  }
}
