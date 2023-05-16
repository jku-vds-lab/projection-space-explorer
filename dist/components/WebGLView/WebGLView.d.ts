import { EntityId } from '@reduxjs/toolkit';
import * as React from 'react';
import * as THREE from 'three';
import { ConnectedProps } from 'react-redux';
import { Camera } from 'three';
import { LassoSelection } from './tools';
import { ICluster } from '../../model/ICluster';
import { TypedObject } from '../../model/TypedObject';
import { ViewTransformType } from '../Ducks/ViewTransformDuck';
import { LineVisualization, PointVisualization } from './meshes';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import { MouseController } from './MouseController';
import { IBook } from '../../model/Book';
import { IEdge } from '../../model/Edge';
import { ClusterDragTool } from './ClusterDragTool';
import { TraceSelectTool } from './TraceSelectTool';
import { DataLine } from '../../model/DataLine';
import { ComponentConfig, FeatureConfig } from '../../BaseConfig';
import { SingleMultipleAttributes } from '../Ducks/ViewDuck';
import { IPosition, IProjection } from '../../model';
type ViewState = {
    camera: Camera;
    menuX: number;
    menuY: number;
    menuTarget: TypedObject;
};
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    dataset: import("../../model").Dataset;
    highlightedSequence: any;
    activeLine: string;
    advancedColoringSelection: any;
    clusterMode: import("..").ClusterMode;
    displayMode: DisplayMode;
    stories: import("../Ducks/StoriesDuck").IStorytelling;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    colorScales: import("../Ducks/ColorScalesDuck").ColorScalesType;
    pointDisplay: {
        checkedShapes: {
            star: boolean;
            cross: boolean;
            circle: boolean;
            square: boolean;
        };
    };
    globalLabels: import("..").GlobalLabelsState;
} & {
    activateView: (id: EntityId) => any;
    selectVectors: (vectors: number[], shiftKey: boolean) => any;
    setActiveLine: (activeLine: any) => any;
    setViewTransform: (camera: any, width: any, height: any, multipleId: any) => any;
    setHoverState: (hoverState: any, updater: any) => any;
    setPointColorMapping: (id: EntityId, mapping: any) => any;
    removeClusterFromStories: (cluster: ICluster) => any;
    addStory: (book: IBook, activate: boolean) => any;
    addClusterToStory: (cluster: ICluster) => any;
    addEdgeToActive: (edge: IEdge) => any;
    setActiveTrace: (trace: any) => any;
    setOpenTab: (tab: any) => any;
    setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
    removeEdgeFromActive: (edge: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    overrideComponents: ComponentConfig;
    featureConfig: FeatureConfig;
    multipleId: EntityId;
    workspace: IPosition[];
    projection: IProjection;
} & Omit<SingleMultipleAttributes, 'workspace'>;
export declare const WebGLView: import("react-redux").ConnectedComponent<{
    new (props: any): {
        lasso: LassoSelection;
        clusterDrag: ClusterDragTool;
        traceSelect: TraceSelectTool;
        particles: PointVisualization;
        containerRef: any;
        selectionRef: any;
        currentHover: TypedObject;
        camera: THREE.OrthographicCamera;
        renderer: THREE.WebGLRenderer;
        lines: LineVisualization;
        scene: THREE.Scene;
        segments: DataLine[];
        pointScene: THREE.Scene;
        mouseMoveListener: any;
        mouseDownListener: any;
        mouseLeaveListener: any;
        keyDownListener: any;
        wheelListener: any;
        mouseUpListener: any;
        infoTimeout: any;
        multivariateClusterView: any;
        invalidated: boolean;
        mouseController: MouseController;
        baseK: number;
        k: number;
        chooseCluster(screenPosition: {
            x: number;
            y: number;
        }): ICluster;
        chooseEdge(position: any): IEdge;
        /**
         * Gives the index of the nearest sample.
         *
         * @param position - The position to pick a sample from
         * @returns The index of a sample
         */
        choose(position: any): number;
        /**
         * Converts mouse coordinates to world coordinates.
         * @param {*} event a dom mouse event.
         */
        relativeMousePosition(event: any): {
            x: number;
            y: number;
        };
        normaliseMouse(event: any): {
            x: number;
            y: number;
        };
        resize(width: any, height: any): void;
        onKeyDown(event: any): void;
        onMouseLeave(event: any): void;
        onMouseDown(event: any): void;
        onMouseMove(event: any): void;
        onMouseUp(event: MouseEvent): void;
        clearSelection(): void;
        onWheel(event: any): void;
        restoreCamera(world: any, screen: any): void;
        getWidth(): any;
        getHeight(): any;
        /**
         * Initializes the callbacks for the MouseController.
         */
        initMouseController(): void;
        setupRenderer(): void;
        createVisualization(dataset: any, lineColorScheme: any, vectorMapping: any): void;
        initializeContainerEvents(): void;
        filterLines(algo: any, show: any): void;
        /**
         *
         * @param checked
         */
        setLineFilter(checked: any): void;
        /**
         * Updates the x,y coordinates of the visualization only. This will also
         * recalculate the optimal camera zoom level.
         */
        updateXY(): void;
        filterPoints(checkboxes: any): void;
        disposeScene(): void;
        /**
         * Starts the render loop
         */
        startRendering(): void;
        /**
         * Render function that gets called with the display refresh rate.
         * Only render overlays here like the lasso selection etc.
         * The rendering of the states + lines and stuff that does not need to be
         * re-rendered for animations should be put in 'requestRender'
         */
        renderLoop(): void;
        onClusterClicked(cluster: ICluster, shiftKey?: boolean): void;
        renderFrame(): void;
        updateItemClusterDisplay(): void;
        createAdditionalColumns(): {
            groupLabel: {
                [key: number]: number[];
            };
        };
        componentDidMount(): void;
        componentDidUpdate(prevProps: Props, prevState: any): void;
        requestRender(): void;
        createTransform(): ViewTransformType;
        renderLasso(ctx: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends keyof ViewState>(state: ViewState | ((prevState: Readonly<ViewState>, props: Readonly<Props>) => ViewState | Pick<ViewState, K>) | Pick<ViewState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<ViewState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<ViewState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<ViewState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void; /**
         * Starts the render loop
         */
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<ViewState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<ViewState>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, import("react-redux").Omit<any, "stories" | "addEdgeToActive" | "setActiveTrace" | "removeEdgeFromActive" | "pointDisplay" | "globalLabels" | "currentAggregation" | "activeLine" | "dataset" | "highlightedSequence" | "advancedColoringSelection" | "clusterMode" | "displayMode" | "hoverState" | "trailSettings" | "colorScales" | "setOpenTab" | "setActiveLine" | "setSelectedCluster" | "addStory" | "removeClusterFromStories" | "activateView" | "selectVectors" | "setViewTransform" | "setHoverState" | "setPointColorMapping" | "addClusterToStory">>;
export {};
//# sourceMappingURL=WebGLView.d.ts.map