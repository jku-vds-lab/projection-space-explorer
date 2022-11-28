import { ConnectedComponent } from 'react-redux';
import { EncodingChannel } from './model/EncodingChannel';
import { EmbeddingController } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingController';
export type BaseConfig = Partial<{
    baseUrl: string;
    preselect: Partial<{
        url: string;
        initOnMount: boolean;
    }>;
}>;
export type EmbeddingMethod = {
    id: string;
    name: string;
    settings: {
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
export type FeatureConfig = Partial<{
    embeddings: EmbeddingMethod[];
    encodings: EncodingChannel[];
    showSummaryAttributes: boolean;
}>;
export type LayerSpec = {
    order: number;
    component: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
};
export type ComponentConfig = Partial<{
    datasetTab: JSX.Element | ((onDataSelected: any) => JSX.Element) | ConnectedComponent<any, any>;
    appBar: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
    detailViews: Array<DetailViewSpec>;
    layers: Array<LayerSpec>;
    tabs: Array<TabSpec>;
    contextMenuItems: Array<ContextMenuItem>;
}>;
export type ContextMenuItem = {
    key: string;
    title: string;
    function: (coords: any) => void;
};
export type DetailViewSpec = {
    name: string;
    view: () => JSX.Element;
};
export type TabSpec = {
    name: string;
    tab: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
    icon: JSX.Element | (() => JSX.Element);
    title: string;
    description: string;
};
