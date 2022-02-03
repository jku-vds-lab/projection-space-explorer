import { ACluster } from '../../model/Cluster';
import { ICluster } from '../../model/ICluster';
import { RenderingContextEx } from '../Utility/RenderingContextEx';
import { CameraTransformations } from './CameraTransformations';
import { Tool } from './Tool';
import { ViewTransformType } from '../Ducks/ViewTransformDuck';
import { IBaseProjection } from '../../model/ProjectionInterfaces';

export class TraceSelectTool implements Tool {
  workspace: IBaseProjection;

  cluster: ICluster;

  viewTransform: ViewTransformType;

  mousePosition: { x: number; y: number };

  constructor(workspace: IBaseProjection, cluster: ICluster) {
    this.workspace = workspace;
    this.cluster = cluster;
  }

  renderToContext(context: RenderingContextEx) {
    if (!this.cluster || !this.viewTransform) {
      return;
    }
    const start = CameraTransformations.worldToScreen(ACluster.getCenterFromWorkspace(this.workspace, this.cluster), this.viewTransform);

    context.lineWidth = '2';

    context.beginPath();
    context.arc(start.x, start.y, 16, 0, 2 * Math.PI, false);
    context.stroke();

    context.strokeStyle = 'red';
    context.beginPath();
    context.arc(this.mousePosition.x, this.mousePosition.y, 21, 0, 2 * Math.PI, false);
    context.stroke();
  }
}
