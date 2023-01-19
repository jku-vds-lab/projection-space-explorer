import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { FPOptions, PSEPlugin } from '../../components/Store/PSEPlugin';
import { StoryLegend } from './StoryDetail/StoryDetail';
import { Dataset } from '../../model/Dataset';

export class GoPlugin extends PSEPlugin {
  type = DatasetType.Story;

  override createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean, options: FPOptions): JSX.Element {
    return <StoryLegend selection={vectors} />;
  }
}
