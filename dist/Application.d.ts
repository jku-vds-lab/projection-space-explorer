import "regenerator-runtime/runtime";
import { Dataset } from "./model/Dataset";
import * as React from "react";
import { ConnectedProps, ConnectedComponent } from 'react-redux';
import { IProjection, IBaseProjection } from "./model/Projection";
import { IBook } from "./model/Book";
import { EmbeddingController } from "./components";
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
export declare type FeatureConfig = Partial<{
    embeddings: EmbeddingMethod[];
}>;
export declare type LayerSpec = {
    order: number;
    component: JSX.Element | ((props: any) => JSX.Element) | ConnectedComponent<any, any>;
};
export declare type ComponentConfig = Partial<{
    datasetTab: JSX.Element | ((onDataSelected: any) => JSX.Element) | ConnectedComponent<any, any>;
    appBar: () => JSX.Element;
    detailViews: Array<DetailViewSpec>;
    layers: Array<LayerSpec>;
    tabs: Array<TabSpec>;
    contextMenuItems: Array<ContextMenuItem>;
}>;
export declare type ContextMenuItem = {
    key: string;
    title: string;
    function: (coords: any) => void;
};
export declare type DetailViewSpec = {
    name: string;
    view: () => JSX.Element;
};
export declare type TabSpec = {
    name: string;
    tab: () => JSX.Element;
    icon: () => JSX.Element;
    title: string;
    description: string;
};
/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    openTab: any;
    dataset: Dataset;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("./model").DatasetEntry;
            };
            allIds: string[];
        };
    };
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    saveProjection: (embedding: IProjection) => any;
    updateWorkspace: (raw: IBaseProjection) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
    setDetailVisibility: (open: any) => any;
    loadDataset: (dataset: Dataset) => any;
}, {}>;
/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    config?: BaseConfig;
    features?: FeatureConfig;
    overrideComponents?: ComponentConfig;
};
/**
 * Main application that contains all other components.
 */
export declare const Application: ConnectedComponent<{
    new (props: any): {
        threeRef: any;
        splitRef: any;
        componentDidMount(): void;
        /**
         * Main callback when the dataset changes
         * @param dataset
         * @param json
         */
        onDataSelected(dataset: Dataset): void;
        /**  finite(dataset: Dataset) {
            const co: CategoryOptions = {
              json: this.props.dataset.categories
            }
        
            this.props.setCategoryOptions(co)
            this.props.setPathLengthMaximum(SegmentFN.getMaxPathLength(dataset))
            this.props.setPathLengthRange([0, SegmentFN.getMaxPathLength(dataset)])
        
            this.props.saveProjection(AProjection.createProjection(dataset.vectors, "Initial Projection"))
            this.props.updateWorkspace(AProjection.createProjection(dataset.vectors, "Initial Projection").positions)
        
            this.props.setGenericFingerprintAttributes(ADataset.getColumns(dataset, true).map(column => ({
              feature: column,
              show: dataset.columns[column].project
            })))
        
            const formatRange = range => {
              try {
                return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
              } catch {
                return 'unknown'
              }
            }
        
            this.props.setProjectionColumns(ADataset.getColumns(dataset, true).map(column => ({
              name: column,
              checked: dataset.columns[column].project,
              normalized: true, //TODO: after benchmarking, reverse this to true,
              range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
              featureLabel: dataset.columns[column].featureLabel
            })))
        
            this.initializeEncodings(dataset)
          }**/
        initializeEncodings(dataset: any): void;
        onLineSelect(algo: any, show: any): void;
        onChangeTab(newTab: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<any>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, Pick<React.ClassAttributes<{
    threeRef: any;
    splitRef: any;
    componentDidMount(): void;
    /**
     * Main callback when the dataset changes
     * @param dataset
     * @param json
     */
    onDataSelected(dataset: Dataset): void;
    /**  finite(dataset: Dataset) {
        const co: CategoryOptions = {
          json: this.props.dataset.categories
        }
    
        this.props.setCategoryOptions(co)
        this.props.setPathLengthMaximum(SegmentFN.getMaxPathLength(dataset))
        this.props.setPathLengthRange([0, SegmentFN.getMaxPathLength(dataset)])
    
        this.props.saveProjection(AProjection.createProjection(dataset.vectors, "Initial Projection"))
        this.props.updateWorkspace(AProjection.createProjection(dataset.vectors, "Initial Projection").positions)
    
        this.props.setGenericFingerprintAttributes(ADataset.getColumns(dataset, true).map(column => ({
          feature: column,
          show: dataset.columns[column].project
        })))
    
        const formatRange = range => {
          try {
            return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
          } catch {
            return 'unknown'
          }
        }
    
        this.props.setProjectionColumns(ADataset.getColumns(dataset, true).map(column => ({
          name: column,
          checked: dataset.columns[column].project,
          normalized: true, //TODO: after benchmarking, reverse this to true,
          range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
          featureLabel: dataset.columns[column].featureLabel
        })))
    
        this.initializeEncodings(dataset)
      }**/
    initializeEncodings(dataset: any): void;
    onLineSelect(algo: any, show: any): void;
    onChangeTab(newTab: any): void;
    render(): JSX.Element;
    context: any;
    setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<Props> & Readonly<{
        children?: React.ReactNode;
    }>;
    state: Readonly<any>;
    refs: {
        [key: string]: React.ReactInstance;
    };
    shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>): any;
    componentDidUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
}> & {
    openTab: any;
    dataset: Dataset;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("./model").DatasetEntry;
            };
            allIds: string[];
        };
    };
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    saveProjection: (embedding: IProjection) => any;
    updateWorkspace: (raw: IBaseProjection) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
    setDetailVisibility: (open: any) => any;
    loadDataset: (dataset: Dataset) => any;
} & {
    config?: BaseConfig;
    features?: FeatureConfig;
    overrideComponents?: ComponentConfig;
}, "ref" | "config" | "features" | "overrideComponents" | "key">>;
export {};
