import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { StoryLegend } from './StoryDetail/StoryDetail';
import { Dataset } from '../../model/Dataset';

export class GoPlugin extends PSEPlugin {
  type = DatasetType.Story;

  createFingerprint(dataset: Dataset, vectors: IVector[]): JSX.Element {
    return <StoryLegend selection={vectors} />;
  }
}
