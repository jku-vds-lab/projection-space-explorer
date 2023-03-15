import { ConnectedComponent } from 'react-redux';
import { EncodingChannel } from './model/EncodingChannel';
import { EmbeddingController } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingController';
import { ProjectionMethod, TypedObject } from './model';

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

export const DEFAULT_UMAP_SETTINGS = { nneighbors: true };

export const DEFAULT_TSNE_SETTINGS = { perplexity: true, learningRate: true };

export const DEFAULT_FA2_SETTINGS = {};

export const DEFAULT_EMBEDDINGS = [
  {
    id: ProjectionMethod.UMAP,
    name: 'UMAP',
    settings: DEFAULT_UMAP_SETTINGS,
    description: 'Performs Uniform Manifold Approximation (UMAP) on the whole dataset using the chosen feature columns. This projects the high-dimensional dataset to a two-dimensional space that will then be shown as a scatterplot.',
    tooltip:
      'Performs Uniform Manifold Approximation (UMAP) on the whole dataset using the chosen feature columns. This method scales better than t-SNE with an increasing number of points.',
  },
  {
    id: ProjectionMethod.TSNE,
    name: 't-SNE',
    settings: DEFAULT_TSNE_SETTINGS,
    description: 'Performs t-distributed stochastic neighbor embedding (t-SNE) on the whole dataset using the chosen feature columns. This projects the high-dimensional dataset to a two-dimensional space that will then be shown as a scatterplot.',
    tooltip: 'Performs t-distributed stochastic neighbor embedding (t-SNE) on the whole dataset using the chosen feature columns.',
  },
  {
    id: ProjectionMethod.FORCEATLAS2,
    name: 'ForceAtlas2',
    settings: DEFAULT_FA2_SETTINGS,
    description: 'Performs the d3 force atlas algorithm. This method only works with sequential data that has duplicates in it (nodes).',
    tooltip: 'Performs the d3 force atlas algorithm. This method only works with sequential data that has duplicates in it (nodes)',
  },
] as EmbeddingMethod[];

export type CoordinatesType = {
  x: number;
  y: number;
};

export type MouseInteractions = {
  onmousemove?: (coordinates: CoordinatesType, event_used: boolean) => void;
  onmouseclick?: (coordinates: CoordinatesType, event_used: boolean, button: number) => void;
};

export type FeatureConfig = Partial<{
  embeddings: EmbeddingMethod[]; // array can either contain strings of predefined embedding methods, or functions
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
  datasetTab: JSX.Element | ((onDataSelected) => JSX.Element) | ConnectedComponent<any, any>;
  appBar: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
  detailViews: Array<DetailViewSpec>;
  layers: Array<LayerSpec>;
  tabs: Array<TabSpec>;
  // contextMenuItems: Array<ContextMenuItem>;
  contextMenuItems: Array<(props: { handleClose: () => void; pos_x: number; pos_y: number; menuTarget: TypedObject }) => JSX.Element>;
  mouseInteractionCallbacks: MouseInteractions;
}>;

// export type ContextMenuItem = {
//   key: string;
//   title: string;
//   function: (coords) => void;
// };

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
