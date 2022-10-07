import * as React from 'react';
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { StoryLegend } from './StoryDetail/StoryDetail';

export class GoPlugin extends PSEPlugin {
  type = DatasetType.Story;

  createFingerprint(vectors: IVector[]): JSX.Element {
    return <StoryLegend selection={vectors} />;
  }
}
