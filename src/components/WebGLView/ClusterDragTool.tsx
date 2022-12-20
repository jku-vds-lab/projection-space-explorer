import { Tool } from './Tool';
import { ICluster } from '../../model/ICluster';
import { RenderingContextEx } from '../Utility/RenderingContextEx';

export class ClusterDragTool implements Tool {
  cluster: ICluster;

  constructor(cluster) {
    this.cluster = cluster;
  }

  renderToContext(context: RenderingContextEx, start, end) {
    context.strokeStyle = 'rgba(0.5, 0.5, 0.5, 0.4)';
    context.lineWidth = '6';

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.arrowTo(start.x, start.y, end.x, end.y, 10);
    context.stroke();
    context.closePath();
  }
}
