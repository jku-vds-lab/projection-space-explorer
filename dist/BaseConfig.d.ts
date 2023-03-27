import { ConnectedComponent } from 'react-redux';
import { EncodingChannel } from './model/EncodingChannel';
import { EmbeddingController } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingController';
import { TypedObject } from './model';
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
        hideSettings?: boolean;
        perplexity?: boolean;
        learningRate?: boolean;
        nneighbors?: boolean;
    };
    description?: JSX.Element | string;
    tooltip?: string;
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
export declare const DEFAULT_EMBEDDINGS: EmbeddingMethod[];
export type CoordinatesType = {
    x: number;
    y: number;
};
export type MouseInteractions = {
    onmousemove?: (coordinates: CoordinatesType, event_used: boolean) => void;
    onmouseclick?: (coordinates: CoordinatesType, event_used: boolean, button: number) => void;
};
export type FeatureConfig = Partial<{
    embeddings: EmbeddingMethod[];
    encodings: EncodingChannel[];
    showSummaryAttributes: boolean;
    showTrailSettings: boolean;
    showVisibleProjections: boolean;
    showTabularTab: boolean;
    enableFeatureWeighing?: boolean;
    detailsTab: Partial<{
        showHoverPositionSelect: boolean;
        showClearSelectionButton: boolean;
        showChooseAttributesButton: boolean;
        showDivider: boolean;
    }>;
    enableStorytelling?: boolean;
    detailViewSplitRatio: [number, number];
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
    contextMenuItems: Array<(props: {
        handleClose: () => void;
        pos_x: number;
        pos_y: number;
        menuTarget: TypedObject;
    }) => JSX.Element>;
    mouseInteractionCallbacks: MouseInteractions;
    tabContainerPrefix: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
}>;
export type DetailViewSpec = {
    name: string;
    /**
     * If true, always render this detail view regardless of being visible/resized.
     */
    alwaysRender?: boolean;
    view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>;
    settings: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>;
};
export type TabSpec = {
    name: string;
    tab: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
    icon: JSX.Element | (() => JSX.Element);
    title: string;
    description: string;
};
//# sourceMappingURL=BaseConfig.d.ts.map