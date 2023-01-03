import * as React from 'react';
import { ConnectedProps } from 'react-redux';
import './coral.scss';
import { Dataset } from '../../../model/Dataset';
import { IVector } from '../../../model/Vector';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: Dataset;
    differenceThreshold: any;
    legendAttributes: any[];
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    width?: number;
    height?: number;
    vectorsA: Array<IVector>;
    vectorsB: Array<IVector>;
    dataset: Dataset;
    scale: number;
};
export declare const CoralChanges: import("react-redux").ConnectedComponent<{
    new (props: any): {
        rows: any[];
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Props>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, import("react-redux").Omit<any, "dataset" | "differenceThreshold" | "legendAttributes">>;
export {};
//# sourceMappingURL=CoralChanges.d.ts.map