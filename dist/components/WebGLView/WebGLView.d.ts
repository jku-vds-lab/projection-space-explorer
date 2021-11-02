import { LassoSelection } from './tools';
import * as React from "react";
import * as THREE from 'three';
import { ICluster } from '../../model/Cluster';
import { TypedObject } from "../../model/TypedObject";
import { IVector } from "../../model/Vector";
import { Camera } from 'three';
import { LineVisualization, PointVisualization } from './meshes';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import { MouseController } from './MouseController';
import { IBook } from '../../model/Book';
import { IEdge } from "../../model/Edge";
import { ClusterDragTool } from './ClusterDragTool';
import { TraceSelectTool } from './TraceSelectTool';
import { Embedding } from '../../model/Embedding';
import { DataLine } from '../../model/DataLine';
declare type ViewState = {
    displayClusters: any;
    camera: Camera;
    menuX: number;
    menuY: number;
    menuTarget: TypedObject;
};
export declare const WebGLView: import("react-redux").ConnectedComponent<{
    new (props: any): {
        lasso: LassoSelection;
        clusterDrag: ClusterDragTool;
        traceSelect: TraceSelectTool;
        particles: PointVisualization;
        containerRef: any;
        selectionRef: any;
        mouseDown: any;
        physicsRef: any;
        mouse: any;
        mouseDownPosition: any;
        initialMousePosition: any;
        currentHover: TypedObject;
        camera: any;
        vectors: IVector[];
        renderer: any;
        lines: LineVisualization;
        scene: THREE.Scene;
        dataset: any;
        lineColorScheme: any;
        segments: DataLine[];
        pointScene: THREE.Scene;
        vectorColorScheme: any;
        prevTime: number;
        sourcePosition: any;
        targetPosition: {
            x: number;
            y: number;
        };
        sourceZoom: any;
        targetZoom: number;
        transitionTime: number;
        trees: any[];
        edgeClusters: any;
        lastTime: number;
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
        /**
         * Initializes the callbacks for the MouseController.
         */
        initMouseController(): void;
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
        componentDidMount(): void;
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
        setupRenderer(): void;
        createVisualization(dataset: any, lineColorScheme: any, vectorColorScheme: any): void;
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
        /**
         * This functions sets the zoom target for a given set of points.
         * This function only needs to be called once to set the target, the view
         * will then slowly adjust the zoom value and position of the camera depending on
         * the speed value supplied.
         */
        setZoomTarget(vectors: any, speed: any): void;
        filterPoints(checkboxes: any): void;
        disposeScene(): void;
        /**
         * Starts the render loop
         */
        startRendering(): void;
        updateZoom(deltaTime: any): void;
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
        componentDidUpdate(prevProps: any, prevState: any): void;
        requestRender(): void;
        createTransform(): {
            camera: any;
            width: any;
            height: any;
        };
        renderLasso(ctx: any): void;
        repositionClusters(): void;
        loadProjection(projection: Embedding): void;
        onClusterZoom(cluster: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "displayClusters" | "camera" | "menuX" | "menuY" | "menuTarget">(state: ViewState | ((prevState: Readonly<ViewState>, props: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>) => ViewState | Pick<ViewState, K>) | Pick<ViewState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<ViewState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, nextState: Readonly<ViewState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, prevState: Readonly<ViewState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, nextState: Readonly<ViewState>, nextContext: any): void; /**
         * Render function that gets called with the display refresh rate.
         * Only render overlays here like the lasso selection etc.
         * The rendering of the states + lines and stuff that does not need to be
         * re-rendered for animations should be put in 'requestRender'
         */
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{
            currentAggregation: {
                aggregation: number[];
                selectedClusters: string[];
                source: "sample" | "cluster";
            };
            vectorByShape: any;
            checkedShapes: any;
            dataset: import("../../model/Dataset").Dataset;
            highlightedSequence: any;
            activeLine: any;
            advancedColoringSelection: any;
            clusterMode: import("..").ClusterMode;
            displayMode: DisplayMode;
            lineBrightness: any;
            pathLengthRange: {
                range: any;
                maximum: number;
            } | {
                range: number[];
                maximum: any;
            };
            globalPointSize: number[];
            globalPointBrightness: number[];
            channelSize: any;
            channelColor: any;
            channelBrightness: any;
            pointColorScale: any;
            stories: import("../Ducks/StoriesDuck").StoriesType;
            trailSettings: {
                show: boolean;
                length: any;
            } | {
                show: any;
                length: number;
            };
            hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
        } & {
            selectVectors: (vectors: number[], shiftKey: boolean) => any;
            setActiveLine: (activeLine: any) => any;
            setViewTransform: (camera: any, width: any, height: any) => any;
            setHoverState: (hoverState: any, updater: any) => any;
            setPointColorMapping: (mapping: any) => any;
            removeClusterFromStories: (cluster: ICluster) => any;
            addStory: (story: IBook, activate: boolean) => any;
            addClusterToStory: (cluster: any) => any;
            addEdgeToActive: (edge: IEdge) => any;
            setActiveTrace: (trace: any) => any;
            setOpenTab: (tab: any) => any;
            setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
            removeEdgeFromActive: (edge: any) => any;
        }>, nextState: Readonly<ViewState>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, Pick<React.ClassAttributes<{
    lasso: LassoSelection;
    clusterDrag: ClusterDragTool;
    traceSelect: TraceSelectTool;
    particles: PointVisualization;
    containerRef: any;
    selectionRef: any;
    mouseDown: any;
    physicsRef: any;
    mouse: any;
    mouseDownPosition: any;
    initialMousePosition: any;
    currentHover: TypedObject;
    camera: any;
    vectors: IVector[];
    renderer: any;
    lines: LineVisualization;
    scene: THREE.Scene;
    dataset: any;
    lineColorScheme: any;
    segments: DataLine[];
    pointScene: THREE.Scene;
    vectorColorScheme: any;
    prevTime: number;
    sourcePosition: any;
    targetPosition: {
        x: number;
        y: number;
    };
    sourceZoom: any;
    targetZoom: number;
    transitionTime: number;
    trees: any[];
    edgeClusters: any;
    lastTime: number;
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
    /**
     * Initializes the callbacks for the MouseController.
     */
    initMouseController(): void;
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
    componentDidMount(): void;
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
    setupRenderer(): void;
    createVisualization(dataset: any, lineColorScheme: any, vectorColorScheme: any): void;
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
    /**
     * This functions sets the zoom target for a given set of points.
     * This function only needs to be called once to set the target, the view
     * will then slowly adjust the zoom value and position of the camera depending on
     * the speed value supplied.
     */
    setZoomTarget(vectors: any, speed: any): void;
    filterPoints(checkboxes: any): void;
    disposeScene(): void;
    /**
     * Starts the render loop
     */
    startRendering(): void;
    updateZoom(deltaTime: any): void;
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
    componentDidUpdate(prevProps: any, prevState: any): void;
    requestRender(): void;
    createTransform(): {
        camera: any;
        width: any;
        height: any;
    };
    renderLasso(ctx: any): void;
    repositionClusters(): void;
    loadProjection(projection: Embedding): void;
    onClusterZoom(cluster: any): void;
    render(): JSX.Element;
    context: any;
    setState<K extends "displayClusters" | "camera" | "menuX" | "menuY" | "menuTarget">(state: ViewState | ((prevState: Readonly<ViewState>, props: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>) => ViewState | Pick<ViewState, K>) | Pick<ViewState, K>, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }> & Readonly<{
        children?: React.ReactNode;
    }>;
    state: Readonly<ViewState>;
    refs: {
        [key: string]: React.ReactInstance;
    };
    shouldComponentUpdate?(nextProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, nextState: Readonly<ViewState>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, prevState: Readonly<ViewState>): any;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, nextState: Readonly<ViewState>, nextContext: any): void; /**
     * Render function that gets called with the display refresh rate.
     * Only render overlays here like the lasso selection etc.
     * The rendering of the states + lines and stuff that does not need to be
     * re-rendered for animations should be put in 'requestRender'
     */
    UNSAFE_componentWillUpdate?(nextProps: Readonly<{
        currentAggregation: {
            aggregation: number[];
            selectedClusters: string[];
            source: "sample" | "cluster";
        };
        vectorByShape: any;
        checkedShapes: any;
        dataset: import("../../model/Dataset").Dataset;
        highlightedSequence: any;
        activeLine: any;
        advancedColoringSelection: any;
        clusterMode: import("..").ClusterMode;
        displayMode: DisplayMode;
        lineBrightness: any;
        pathLengthRange: {
            range: any;
            maximum: number;
        } | {
            range: number[];
            maximum: any;
        };
        globalPointSize: number[];
        globalPointBrightness: number[];
        channelSize: any;
        channelColor: any;
        channelBrightness: any;
        pointColorScale: any;
        stories: import("../Ducks/StoriesDuck").StoriesType;
        trailSettings: {
            show: boolean;
            length: any;
        } | {
            show: any;
            length: number;
        };
        hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
    } & {
        selectVectors: (vectors: number[], shiftKey: boolean) => any;
        setActiveLine: (activeLine: any) => any;
        setViewTransform: (camera: any, width: any, height: any) => any;
        setHoverState: (hoverState: any, updater: any) => any;
        setPointColorMapping: (mapping: any) => any;
        removeClusterFromStories: (cluster: ICluster) => any;
        addStory: (story: IBook, activate: boolean) => any;
        addClusterToStory: (cluster: any) => any;
        addEdgeToActive: (edge: IEdge) => any;
        setActiveTrace: (trace: any) => any;
        setOpenTab: (tab: any) => any;
        setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
        removeEdgeFromActive: (edge: any) => any;
    }>, nextState: Readonly<ViewState>, nextContext: any): void;
}> & {
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    vectorByShape: any;
    checkedShapes: any;
    dataset: import("../../model/Dataset").Dataset;
    highlightedSequence: any;
    activeLine: any;
    advancedColoringSelection: any;
    clusterMode: import("..").ClusterMode;
    displayMode: DisplayMode;
    lineBrightness: any;
    pathLengthRange: {
        range: any;
        maximum: number;
    } | {
        range: number[];
        maximum: any;
    };
    globalPointSize: number[];
    globalPointBrightness: number[];
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    pointColorScale: any;
    stories: import("../Ducks/StoriesDuck").StoriesType;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    hoverState: import("../Ducks/HoverStateDuck").HoverStateType;
} & {
    selectVectors: (vectors: number[], shiftKey: boolean) => any;
    setActiveLine: (activeLine: any) => any;
    setViewTransform: (camera: any, width: any, height: any) => any;
    setHoverState: (hoverState: any, updater: any) => any;
    setPointColorMapping: (mapping: any) => any;
    removeClusterFromStories: (cluster: ICluster) => any;
    addStory: (story: IBook, activate: boolean) => any;
    addClusterToStory: (cluster: any) => any;
    addEdgeToActive: (edge: IEdge) => any;
    setActiveTrace: (trace: any) => any;
    setOpenTab: (tab: any) => any;
    setSelectedCluster: (clusters: string[], shiftKey: boolean) => any;
    removeEdgeFromActive: (edge: any) => any;
}, "ref" | "key">>;
export {};