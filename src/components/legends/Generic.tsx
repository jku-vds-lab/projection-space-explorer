import * as React from 'react';
import { CoralLegend } from '../../plugins/Coral/CoralDetail/CoralDetail';
import { TrrackLegend } from '../../plugins/Trrack/TrrackDetail/TrrackDetail';
import { StoryLegend } from '../../plugins/Story/StoryDetail/StoryDetail';
import { RubikFingerprint } from '../../plugins/Rubik/RubikFingerprint/RubikFingerprint';
import { ChessFingerprint } from '../../plugins/Chess/ChessFingerprint/ChessFingerprint';
import { IVector } from '../../model/Vector';
import { PluginRegistry } from '../Store/PluginScript';
import { DatasetType } from '../../model/DatasetType';
import { GoLegend } from '../../plugins/Go/GoLegend';
import { usePSESelector } from '../Store';
import { FPOptions } from '../Store/PSEPlugin';

type GenericLegendProps = {
  type: DatasetType;
  vectors: IVector[];
  aggregate: boolean;
  scale?: number;
  options?: FPOptions;
};

// shows single and aggregated view
export function GenericLegend({ type, vectors, aggregate, scale = 2, options }: GenericLegendProps) {
  const dataset = usePSESelector((state) => state.dataset);

  const plugin = PluginRegistry.getInstance().getPlugin(type);
  if (plugin) {
    // use plugin before defaults
    return plugin.createFingerprint(dataset, vectors, scale, aggregate, options);
  }
  // --deprecated-- defaults... in case no plugin is specific
  switch (type) {
    case DatasetType.Story:
      return <StoryLegend selection={vectors} />;
    case DatasetType.Rubik:
      return <RubikFingerprint vectors={vectors} width={81 * scale} height={108 * scale} />;
    case DatasetType.Chess:
      return <ChessFingerprint width={144 * scale} height={144 * scale} vectors={vectors} />;
    case DatasetType.Cohort_Analysis:
      return <CoralLegend selection={vectors} aggregate={aggregate} />;
    case DatasetType.Trrack:
      return <TrrackLegend selection={vectors} aggregate={aggregate} />;
    case DatasetType.Go:
      return <GoLegend selection={vectors} aggregate={aggregate} />;
    default:
      return <CoralLegend selection={vectors} aggregate={aggregate} />;
  }
}
