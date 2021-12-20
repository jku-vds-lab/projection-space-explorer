import { Scene } from "three";
import THREE = require("three");
import { IVector } from "../../model/Vector";
import { DisplayMode } from "../Ducks/DisplayModeDuck";
import React = require("react");
import { ConnectedProps } from "react-redux";
import { TrailVisualization } from "./TrailVisualization";
import { IBook } from "../../model/Book";
import { ViewTransformType } from "../Ducks";
declare type ClusterObjectType = {
    cluster: string;
    geometry: THREE.Geometry;
    material: THREE.MeshBasicMaterial;
    mesh: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>;
    children: any[];
    trailPositions: any[];
    lineColor: any;
    triangulatedMesh: any;
    sampleConnection: boolean;
};
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<import("react-redux").DispatchProp<import("redux").AnyAction> & {
    dataset: import("../..").Dataset;
    displayMode: DisplayMode;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    stories: import("../Ducks").IStorytelling;
    globalPointSize: number[];
    viewTransform: ViewTransformType;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    hoverState: import("../Ducks").HoverStateType;
    groupVisualizationMode: any;
    workspace: import("../..").IBaseProjection;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    onInvalidate?: () => void;
};
/**
 * Clustering visualization as a React component.
 */
export declare const MultivariateClustering: import("react-redux").ConnectedComponent<{
    new (props: any): {
        arrowMesh: THREE.Mesh;
        trailMesh: THREE.Mesh;
        scene: Scene;
        lineMesh: THREE.Mesh;
        clusterObjects: ClusterObjectType[];
        devicePixelRatio: number;
        scalingScene: Scene;
        length: number;
        clusterVis: {
            clusterMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];
            lineMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];
        };
        trail: TrailVisualization;
        clusterScene: THREE.Scene;
        triangulationWorker: Worker;
        componentDidUpdate(prevProps: Props): void;
        updateArrows(zoom: number): void;
        /**
         * Updates geometry of the trail mesh.
         */
        updateTrail(zoom: number): void;
        iterateTrail(zoom: any): void;
        updatePositions(zoom: number): void;
        getColorForClusterObject(clusterObject: ClusterObjectType): THREE.Color;
        /**
         * Creates the visualization.
         */
        create(): void;
        highlightSamples(samples: IVector[]): void;
        deactivateAll(): void;
        highlightCluster(indices?: string[]): void;
        /**
         * Destroys the visualization.
         */
        destroy(): void;
        /**
         * Creates the triangulated mesh that visualizes the clustering.
         * @param clusters an array of clusters
         */
        createTriangulatedMesh(): void;
        /**
         * Destroys the triangulated view of the clusters.
         */
        disposeTriangulatedMesh(): void;
        /**
         * Creates textual representations of the edges of the story.
         */
        createStreetLabels(story?: IBook): any[];
        /**
         * Render an empty div, so componentDidMount will get called.
         */
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
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, Pick<React.ClassAttributes<{
    arrowMesh: THREE.Mesh;
    trailMesh: THREE.Mesh;
    scene: Scene;
    lineMesh: THREE.Mesh;
    clusterObjects: ClusterObjectType[];
    devicePixelRatio: number;
    scalingScene: Scene;
    length: number;
    clusterVis: {
        clusterMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];
        lineMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];
    };
    trail: TrailVisualization;
    clusterScene: THREE.Scene;
    triangulationWorker: Worker;
    componentDidUpdate(prevProps: Props): void;
    updateArrows(zoom: number): void;
    /**
     * Updates geometry of the trail mesh.
     */
    updateTrail(zoom: number): void;
    iterateTrail(zoom: any): void;
    updatePositions(zoom: number): void;
    getColorForClusterObject(clusterObject: ClusterObjectType): THREE.Color;
    /**
     * Creates the visualization.
     */
    create(): void;
    highlightSamples(samples: IVector[]): void;
    deactivateAll(): void;
    highlightCluster(indices?: string[]): void;
    /**
     * Destroys the visualization.
     */
    destroy(): void;
    /**
     * Creates the triangulated mesh that visualizes the clustering.
     * @param clusters an array of clusters
     */
    createTriangulatedMesh(): void;
    /**
     * Destroys the triangulated view of the clusters.
     */
    disposeTriangulatedMesh(): void;
    /**
     * Creates textual representations of the edges of the story.
     */
    createStreetLabels(story?: IBook): any[];
    /**
     * Render an empty div, so componentDidMount will get called.
     */
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
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): void;
}> & import("react-redux").DispatchProp<import("redux").AnyAction> & {
    dataset: import("../..").Dataset;
    displayMode: DisplayMode;
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
    stories: import("../Ducks").IStorytelling;
    globalPointSize: number[];
    viewTransform: ViewTransformType;
    currentAggregation: {
        aggregation: number[];
        selectedClusters: string[];
        source: "sample" | "cluster";
    };
    hoverState: import("../Ducks").HoverStateType;
    groupVisualizationMode: any;
    workspace: import("../..").IBaseProjection;
} & {
    onInvalidate?: () => void;
}, "ref" | "key" | "onInvalidate">>;
export {};
