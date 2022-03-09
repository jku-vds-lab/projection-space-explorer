import { ConnectedComponent } from 'react-redux';
import { EncodingChannel } from './model/EncodingChannel';
import { EmbeddingController } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingController';
import { ProjectionMethod } from './model';

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
  embController?: EmbeddingController;
};

export const DEFAULT_UMAP_SETTINGS = { nneighbors: true };

export const DEFAULT_TSNE_SETTINGS = { perplexity: true, learningRate: true };

export const DEFAULT_FA2_SETTINGS = {};

export const DEFAULT_EMBEDDINGS = [
  { id: ProjectionMethod.UMAP, name: 'UMAP', settings: DEFAULT_UMAP_SETTINGS },
  { id: ProjectionMethod.TSNE, name: 't-SNE', settings: DEFAULT_TSNE_SETTINGS },
  { id: ProjectionMethod.FORCEATLAS2, name: 'ForceAtlas2', settings: DEFAULT_FA2_SETTINGS },
];

export type MouseInteractions = {
  "mousedown": (coordinates: any) => void
  "mouseup": (coordinates: any) => void
  "mousemove": (coordinates: any, event_used: boolean) => void
  "mouseclick": (coordinates: any, event_used: boolean, button:number) => void
}

export type FeatureConfig = Partial<{
  embeddings: EmbeddingMethod[]; // array can either contain strings of predefined embedding methods, or functions
  encodings: EncodingChannel[];
}>;

export type LayerSpec = {
  order: number;
  component: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
};

export type ComponentConfig = Partial<{
  datasetTab: JSX.Element | ((onDataSelected) => JSX.Element) | ConnectedComponent<any, any>;
  appBar: () => JSX.Element;
  detailViews: Array<DetailViewSpec>;
  layers: Array<LayerSpec>;
  tabs: Array<TabSpec>;
  contextMenuItems: Array<ContextMenuItem>;
  mouseInteractionHooks: MouseInteractions;
}>;

export type ContextMenuItem = {
  key: string;
  title: string;
  function: (coords) => void;
};

export type DetailViewSpec = {
  name: string;
  view: () => JSX.Element; // JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>
};

export type TabSpec = {
  name: string;
  tab: () => JSX.Element;
  icon: () => JSX.Element;
  title: string;
  description: string;
};
