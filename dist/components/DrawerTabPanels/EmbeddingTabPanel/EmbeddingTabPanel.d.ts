import { ConnectedProps } from 'react-redux';
import { Dataset } from "../../../model/Dataset";
import { IProjection, IBaseProjection } from '../../../model/Projection';
import { FeatureConfig } from '../../../Application';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    stories: import("../../..").IStorytelling;
    projectionWorker: Worker;
    projectionOpen: any;
    dataset: Dataset;
    projections: {
        byId: {
            [id: string]: IProjection;
        };
        allIds: string[];
        workspace: IBaseProjection;
    };
    workspace: IBaseProjection;
} & {
    setProjectionOpen: (value: any) => any;
    setProjectionWorker: (value: any) => any;
    setProjectionColumns: (value: any) => any;
    setTrailVisibility: (visibility: any) => any;
    addProjection: (embedding: any) => any;
    deleteProjection: (handle: string) => any;
    updateWorkspace: (workspace: IBaseProjection) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    config: FeatureConfig;
    projectionWorker?: Worker;
    projectionOpen?: boolean;
    setProjectionOpen?: any;
    setProjectionWorker?: any;
    dataset?: Dataset;
    webGLView?: any;
};
export declare const EmbeddingTabPanel: import("react-redux").ConnectedComponent<(props: Props) => JSX.Element, Pick<Props, "config" | "webGLView">>;
export {};
