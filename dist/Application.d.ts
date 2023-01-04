import 'regenerator-runtime/runtime';
import './index.scss';
import * as React from 'react';
import { ConnectedProps } from 'react-redux';
import Split from 'react-split';
import { Dataset } from './model/Dataset';
import { BaseConfig, FeatureConfig, ComponentConfig } from './BaseConfig';
/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    openTab: any;
    dataset: Dataset;
    hoverStateOrientation: any;
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("./model").DatasetEntry;
            };
            allIds: string[];
        };
    };
    globalLabels: import(".").GlobalLabelsState;
} & {
    setOpenTab: (openTab: any) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
    setLineUpInput_visibility: (open: any) => any;
    loadDataset: (dataset: Dataset) => any;
}, {}>;
/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    config?: BaseConfig;
    features?: FeatureConfig;
    overrideComponents?: ComponentConfig;
};
/**
 * Main application that contains all other components.
 */
export declare const Application: import("react-redux").ConnectedComponent<{
    new (props: any): {
        splitRef: React.LegacyRef<Split>;
        componentDidMount(): void;
        /**
         * Main callback when the dataset changes
         * @param dataset
         * @param json
         */
        onDataSelected(dataset: Dataset): void;
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
}, import("react-redux").Omit<any, "dataset" | "globalLabels" | "openTab" | "hoverStateOrientation" | "datasetEntries" | "setOpenTab" | "setLineByOptions" | "setGlobalPointBrightness" | "setGroupVisualizationMode" | "setLineUpInput_visibility" | "loadDataset">>;
export {};
//# sourceMappingURL=Application.d.ts.map