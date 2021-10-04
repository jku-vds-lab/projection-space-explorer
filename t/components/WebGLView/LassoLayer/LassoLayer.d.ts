import './LassoLayer.scss';
import * as React from 'react';
import { CameraTransformations } from '../CameraTransformations';
declare type LassoLayerProps = {
    viewTransform: CameraTransformations;
};
export declare var LassoLayer: import("react-redux").ConnectedComponent<{
    new (props: any): {
        setDimensions(width: any, height: any): void;
        renderHighlightedSequence(context: CanvasRenderingContext2D, highlightedSequence: {
            previous;
            current;
            next;
        }): void;
        getContext(): any;
        render(): JSX.Element;
        context: any;
        setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<LassoLayerProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<any>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<LassoLayerProps>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<LassoLayerProps>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<LassoLayerProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<LassoLayerProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, Pick<React.ClassAttributes<{
    setDimensions(width: any, height: any): void;
    renderHighlightedSequence(context: CanvasRenderingContext2D, highlightedSequence: {
        previous;
        current;
        next;
    }): void;
    getContext(): any;
    render(): JSX.Element;
    context: any;
    setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<LassoLayerProps> & Readonly<{
        children?: React.ReactNode;
    }>;
    state: Readonly<any>;
    refs: {
        [key: string]: React.ReactInstance;
    };
    componentDidMount?(): void;
    shouldComponentUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<LassoLayerProps>, prevState: Readonly<any>): any;
    componentDidUpdate?(prevProps: Readonly<LassoLayerProps>, prevState: Readonly<any>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<LassoLayerProps>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<LassoLayerProps>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<LassoLayerProps>, nextState: Readonly<any>, nextContext: any): void;
}> & LassoLayerProps, "ref" | "key">>;
export {};
