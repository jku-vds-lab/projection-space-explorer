import { ConnectedComponent } from 'react-redux';
import { EncodingChannel } from './model/EncodingChannel';
import { EmbeddingController } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingController';
import { TypedObject } from './model';
export declare type BaseConfig = Partial<{
    baseUrl: string;
    preselect: Partial<{
        url: string;
        initOnMount: boolean;
    }>;
}>;
export declare type EmbeddingMethod = {
    id: string;
    name: string;
    settings: {
        hideSettings?: boolean;
        perplexity?: boolean;
        learningRate?: boolean;
        nneighbors?: boolean;
    };
    embController?: EmbeddingController;
};
export declare const DEFAULT_UMAP_SETTINGS: {
    nneighbors: boolean;
};
export declare const DEFAULT_TSNE_SETTINGS: {
    perplexity: boolean;
    learningRate: boolean;
};
export declare const DEFAULT_FA2_SETTINGS: {};
export declare const DEFAULT_EMBEDDINGS: {
    id: string;
    name: string;
    settings: {};
}[];
export declare type CoordinatesType = {
    x: number;
    y: number;
};
export declare type MouseInteractions = {
    onmousemove?: (coordinates: CoordinatesType, event_used: boolean) => void;
    onmouseclick?: (coordinates: CoordinatesType, event_used: boolean, button: number) => void;
};
export declare type FeatureConfig = Partial<{
    embeddings: EmbeddingMethod[];
    encodings: EncodingChannel[];
    showSummaryAttributes: boolean;
}>;
export declare type LayerSpec = {
    order: number;
    component: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
};
export declare type ComponentConfig = Partial<{
    datasetTab: JSX.Element | ((onDataSelected: any) => JSX.Element) | ConnectedComponent<any, any>;
    appBar: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
    detailViews: Array<DetailViewSpec>;
    layers: Array<LayerSpec>;
    tabs: Array<TabSpec>;
    contextMenuItems: Array<(props: {
        handleClose: () => void;
        pos_x: number;
        pos_y: number;
        menuTarget: TypedObject;
    }) => JSX.Element>;
    mouseInteractionCallbacks: MouseInteractions;
}>;
export declare type DetailViewSpec = {
    name: string;
    view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>;
    settings: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>;
};
export declare type TabSpec = {
    name: string;
    tab: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
    icon: () => JSX.Element;
    title: string;
    description: string;
};
