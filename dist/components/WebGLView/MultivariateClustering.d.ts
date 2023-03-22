import { Scene } from 'three';
import { EntityId } from '@reduxjs/toolkit';
import * as THREE from 'three';
import * as React from 'react';
import { ConnectedProps } from 'react-redux';
import { IVector } from '../../model/Vector';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import { TrailVisualization } from './TrailVisualization';
import { IBook } from '../../model/Book';
import { ViewTransformType } from '../Ducks';
import { IPosition } from '../../model/ProjectionInterfaces';
type ClusterObjectType = {
    cluster: EntityId;
    geometry: THREE.Geometry;
    material: THREE.MeshBasicMaterial;
    mesh: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>;
    children: {
        sample: number;
        visible: boolean;
    }[];
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
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    hoverState: import("../Ducks").HoverStateType;
    groupVisualizationMode: any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    onInvalidate?: () => void;
    viewTransform: ViewTransformType;
    workspace: IPosition[];
    globalPointSize: any;
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
        clusterVis: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];
        trail: TrailVisualization;
        clusterScene: THREE.Scene;
        componentDidMount(): void;
        componentDidUpdate(prevProps: Props): void;
        getColorForClusterObject(clusterObject: ClusterObjectType): THREE.Color;
        updateArrows(zoom: number): void;
        /**
         * Updates geometry of the trail mesh.
         */
        updateTrail(zoom: number): void;
        iterateTrail(): void;
        updatePositions(zoom: number): void;
        /**
         * Creates the visualization.
         */
        create(): void;
        highlightSamples(samples: IVector[]): void;
        deactivateAll(): void;
        highlightCluster(indices?: EntityId[]): void;
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
}, import("react-redux").Omit<any, "dataset" | "stories" | "currentAggregation" | "displayMode" | "hoverState" | "trailSettings" | "groupVisualizationMode" | "dispatch">>;
export {};
//# sourceMappingURL=MultivariateClustering.d.ts.map