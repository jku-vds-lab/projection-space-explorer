import { Tool } from './Tool';
import { ICluster } from '../../model/ICluster';
import { RenderingContextEx } from '../Utility/RenderingContextEx';
export declare class ClusterDragTool implements Tool {
    cluster: ICluster;
    constructor(cluster: any);
    renderToContext(context: RenderingContextEx, start: any, end: any): void;
}
//# sourceMappingURL=ClusterDragTool.d.ts.map