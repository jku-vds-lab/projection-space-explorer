import "regenerator-runtime/runtime";
import { Dataset } from "./model/Dataset";
import * as React from "react";
import { ConnectedProps } from 'react-redux';
import { CategoryOptions } from "./components/WebGLView/CategoryOptions";
import { IBook } from "./model/Book";
export declare type BaseConfig = Partial<{
    baseUrl: string;
    preselect: Partial<{
        url: string;
        initOnMount: boolean;
    }>;
}>;
export declare type FeatureConfig = Partial<{
    disableEmbeddings: {
        tsne?: boolean;
        umap?: boolean;
        forceatlas?: boolean;
    };
}>;
export declare type ComponentConfig = Partial<{
    datasetTab: (props: {
        onDataSelected(dataset: Dataset): void;
    }) => JSX.Element;
    appBar: () => JSX.Element;
    detailViews: Array<DetailViewSpec>;
    tabs: Array<TabSpec>;
}>;
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
    categoryOptions: CategoryOptions;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setDataset: (dataset: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setCategoryOptions: (categoryOptions: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    saveProjection: (embedding: any) => any;
    setVectors: (vectors: any) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
    setLineUpInput_visibility: (open: any) => any;
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
export declare const Application: import("react-redux").ConnectedComponent<{
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
        finite(dataset: Dataset): void;
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
    finite(dataset: Dataset): void;
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
    categoryOptions: CategoryOptions;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setDataset: (dataset: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setCategoryOptions: (categoryOptions: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    saveProjection: (embedding: any) => any;
    setVectors: (vectors: any) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
    setLineUpInput_visibility: (open: any) => any;
} & {
    config?: BaseConfig;
    features?: FeatureConfig;
    overrideComponents?: ComponentConfig;
}, "ref" | "config" | "features" | "overrideComponents" | "key">>;
export {};
