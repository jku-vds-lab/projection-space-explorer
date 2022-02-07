import React = require('react');
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { CoralLegend } from './CoralDetail/CoralDetail';
import { PSEPlugin } from '../../components/Store/PSEPlugin';

export class CoralPlugin extends PSEPlugin {
  type = DatasetType.Cohort_Analysis;

  createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
    return <CoralLegend selection={vectors} aggregate={aggregate} />;
  }
}
