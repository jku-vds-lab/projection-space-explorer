import { ICluster } from '../../model/ICluster';
import { RenderingContextEx } from '../Utility/RenderingContextEx';
import { Tool } from './Tool';
import { ViewTransformType } from '../Ducks/ViewTransformDuck';
import { IBaseProjection } from '../../model/ProjectionInterfaces';
export declare class TraceSelectTool implements Tool {
    workspace: IBaseProjection;
    cluster: ICluster;
    viewTransform: ViewTransformType;
    mousePosition: {
        x: number;
        y: number;
    };
    constructor(workspace: IBaseProjection, cluster: ICluster);
    renderToContext(context: RenderingContextEx): void;
}
