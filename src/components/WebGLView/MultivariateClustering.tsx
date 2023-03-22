/* eslint-disable react/display-name */
import * as d3v5 from 'd3v5';
import { Scene, Vector2, Vector3 } from 'three';
import { EntityId } from '@reduxjs/toolkit';
import * as THREE from 'three';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Typography } from '@mui/material';
import { IVector } from '../../model/Vector';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import type { RootState } from '../Store/Store';
import { TrailVisualization } from './TrailVisualization';
import { ACluster, isCluster } from '../../model/Cluster';
import { ICluster } from '../../model/ICluster';
import { CameraTransformations } from './CameraTransformations';
import { IBook } from '../../model/Book';
import * as nt from '../NumTs/NumTs';

import { GroupVisualizationMode } from '../Ducks/GroupVisualizationMode';
import { ViewTransformType } from '../Ducks';
import { SchemeColor } from '../Utility/Colors/SchemeColor';
import { AStorytelling } from '../Ducks/StoriesDuck';
import { IPosition } from '../../model/ProjectionInterfaces';

const SELECTED_COLOR = 0x007dad;
const DEFAULT_COLOR = 0x808080;
const GRAYED = 0xdcdcdc;

const WING_SIZE = 2.2;
const LINE_WIDTH = 1.5;

const CLUSTER_PIXEL_SIZE = 12;

const hoverLabel = (hoverState: ICluster, viewTransform: ViewTransformType, workspace) => {
  const screen = CameraTransformations.worldToScreen(ACluster.getCenterFromWorkspace(workspace, hoverState), viewTransform);

  return (
    <Typography
      style={{
        textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
        position: 'absolute',
        left: screen.x,
        top: screen.y,
        background: 'transparent',
        color: 'black',
        fontWeight: 'bold',
        transform: 'translate(-50%, -150%)',
        pointerEvents: 'none',
        fontSize: '16px',
      }}
    >
      {ACluster.getTextRepresentation(hoverState)}
    </Typography>
  );
};

type ClusterObjectType = {
  cluster: EntityId;
  geometry: THREE.Geometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>;
  children: { sample: number; visible: boolean }[];
  trailPositions: any[];
  lineColor: any;
  triangulatedMesh: any;
  sampleConnection: boolean;
};

const mapState = (state: RootState) => ({
  dataset: state.dataset,
  displayMode: state.displayMode,
  trailSettings: state.trailSettings,
  stories: state.stories,
  currentAggregation: state.currentAggregation,
  hoverState: state.hoverState,
  groupVisualizationMode: state.groupVisualizationMode,
});

const connector = connect(mapState, null, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  // Callback that is called when a rerender should happen
  onInvalidate?: () => void;
  viewTransform: ViewTransformType;
  workspace: IPosition[];
  globalPointSize;
};

/**
 * Clustering visualization as a React component.
 */
export const MultivariateClustering = connector(
  class extends React.Component<Props> {
    // arrowMesh
    arrowMesh: THREE.Mesh;

    trailMesh: THREE.Mesh;

    scene: Scene;

    lineMesh: THREE.Mesh;

    clusterObjects: ClusterObjectType[] = [];

    devicePixelRatio: number;

    scalingScene: Scene;

    clusterVis: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[];

    trail: TrailVisualization;

    clusterScene: THREE.Scene;

    constructor(props) {
      super(props);

      this.devicePixelRatio = window.devicePixelRatio;
      this.scalingScene = new THREE.Scene();
      this.scene = new THREE.Scene();
      this.clusterScene = new THREE.Scene();

      const arrowMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true });
      arrowMateral.opacity = 0.8;
      arrowMateral.transparent = true;

      this.arrowMesh = new THREE.Mesh(new THREE.Geometry(), arrowMateral);
      this.scene.add(this.arrowMesh);

      this.trailMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, vertexColors: true }));
      this.scene.add(this.trailMesh);

      this.trail = new TrailVisualization();
      this.trail.create();
      this.scene.add(this.trail.mesh);
    }

    componentDidMount() {
      if (this.props.stories.active !== null && this.props.workspace) {
        const activeStory = AStorytelling.getActive(this.props.stories);

        if (activeStory.clusters.ids.length > 0) {
          this.create();
          this.createTriangulatedMesh();
        }
      }
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.trailSettings !== this.props.trailSettings) {
        this.trail.setVisible(this.props.trailSettings.show);
        this.trail.setLength(this.props.trailSettings.length);
      }

      // If we have clusters now... and are on clusters tab... create cluster visualization
      if (prevProps.stories !== this.props.stories && this.props.workspace) {
        this.destroy();
        this.disposeTriangulatedMesh();

        if (this.props.stories.active !== null) {
          const activeStory = AStorytelling.getActive(this.props.stories);

          if (activeStory.clusters.ids.length > 0) {
            this.create();
            this.createTriangulatedMesh();
          }
        }
      }

      if (prevProps.displayMode !== this.props.displayMode) {
        switch (this.props.displayMode) {
          case DisplayMode.StatesAndClusters:
            this.highlightCluster(this.props.currentAggregation.selectedClusters);
            this.clusterScene.visible = true;
            this.scalingScene.visible = true;
            this.scene.visible = true;
            break;
          case DisplayMode.OnlyClusters:
            this.clusterScene.visible = true;
            this.scalingScene.visible = true;
            this.scene.visible = true;
            this.clusterObjects.forEach((clusterObject) => {
              clusterObject.children.forEach((child) => {
                child.visible = false;
              });
            });
            break;
          case DisplayMode.OnlyStates:
          case DisplayMode.None:
            this.clusterScene.visible = false;
            this.scalingScene.visible = false;
            this.scene.visible = false;

            break;
          default:
            break;
        }
      }

      if (prevProps.currentAggregation !== this.props.currentAggregation || prevProps.groupVisualizationMode !== this.props.groupVisualizationMode) {
        this.deactivateAll();

        if (this.props.currentAggregation.source === 'sample') {
          this.highlightSamples(this.props.currentAggregation.aggregation.map((i) => this.props.dataset.vectors[i]));
        }

        // if the hoverCluster state changed and its a multivariate cluster, we need to enable the three js scene part
        if (this.props.currentAggregation.source === 'cluster') {
          this.highlightCluster(this.props.currentAggregation.selectedClusters);
        }
      }

      if (prevProps.workspace !== this.props.workspace && this.props.workspace) {
        // TODO: check performance implications
        this.updatePositions(this.props.viewTransform.zoom);
        this.createTriangulatedMesh();
      }

      if (this.props.onInvalidate) {
        this.props.onInvalidate();
      }
    }

    getColorForClusterObject(clusterObject: ClusterObjectType) {
      if (this.props.currentAggregation.selectedClusters.includes(clusterObject.cluster) || clusterObject.sampleConnection) {
        return new THREE.Color(SELECTED_COLOR);
      }
      const activeStory = AStorytelling.getActive(this.props.stories);
      if (activeStory?.clusters?.ids.includes(clusterObject.cluster)) {
        return new THREE.Color(DEFAULT_COLOR);
      }
      return new THREE.Color(GRAYED);
    }

    updateArrows(zoom: number) {
      if (!this.arrowMesh) {
        return;
      }

      this.arrowMesh.visible = true;
      this.arrowMesh.geometry.dispose();
      const arrowGeometry = new THREE.Geometry();
      arrowGeometry.vertices = [];
      arrowGeometry.faces = [];

      let index = 0;
      const activeStory = AStorytelling.getActive(this.props.stories);
      if (activeStory) {
        for (const [key, edge] of Object.entries(activeStory.edges.entities)) {
          let color = new THREE.Color(DEFAULT_COLOR);
          if (this.props.stories.trace && this.props.stories.trace.mainEdges.includes(key)) {
            color = new THREE.Color(SELECTED_COLOR);
          }

          const sourceCenter = ACluster.getCenterFromWorkspace(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.source));
          const destCenter = ACluster.getCenterFromWorkspace(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.destination));
          const start = new THREE.Vector2(sourceCenter.x, sourceCenter.y);
          const end = new THREE.Vector2(destCenter.x, destCenter.y);
          const middle = new THREE.Vector2().addVectors(start, new THREE.Vector2().subVectors(end, start).multiplyScalar(0.5));

          const dir = end.clone().sub(start).normalize();
          const left = new Vector2(-dir.y, dir.x).multiplyScalar(LINE_WIDTH);
          const right = new Vector2(dir.y, -dir.x).multiplyScalar(LINE_WIDTH);
          const offset = dir.clone().multiplyScalar(this.devicePixelRatio * CLUSTER_PIXEL_SIZE);

          // line without arrow
          arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + left.x + offset.x, start.y * zoom + left.y + offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + right.x + offset.x, start.y * zoom + right.y + offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + left.x - offset.x, end.y * zoom + left.y - offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + right.x - offset.x, end.y * zoom + right.y - offset.y, 0));

          // left wing
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x - offset.x, middle.y * zoom + left.y - offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x + offset.x, middle.y * zoom + left.y + offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x * WING_SIZE - offset.x, middle.y * zoom + left.y * WING_SIZE - offset.y, 0));

          // Right wing
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x - offset.x, middle.y * zoom + right.y - offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x + offset.x, middle.y * zoom + right.y + offset.y, 0));
          arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x * WING_SIZE - offset.x, middle.y * zoom + right.y * WING_SIZE - offset.y, 0));

          const i = index * 10;
          // line without arrow
          arrowGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new Vector3(0, 0, -1), color));
          arrowGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new Vector3(0, 0, -1), color));

          // left wing
          arrowGeometry.faces.push(new THREE.Face3(i + 4, i + 6, i + 5, new Vector3(0, 0, -1), color));

          // Right wing
          arrowGeometry.faces.push(new THREE.Face3(i + 7, i + 9, i + 8, new Vector3(0, 0, -1), color));

          index += 1;
        }
      }

      this.arrowMesh.geometry = arrowGeometry;
    }

    /**
     * Updates geometry of the trail mesh.
     */
    updateTrail(zoom: number) {
      this.trail.update(this.clusterObjects, zoom);
    }

    iterateTrail() {
      const activeStory = AStorytelling.getActive(this.props.stories);
      this.clusterObjects.forEach((clusterObject) => {
        const center = ACluster.getCenterFromWorkspace(this.props.workspace, activeStory.clusters.entities[clusterObject.cluster]);

        const last = clusterObject.trailPositions[clusterObject.trailPositions.length - 1];
        if (!last || new THREE.Vector3(center.x, center.y, 0).distanceTo(last) > 0.1) {
          const positions = clusterObject.trailPositions;

          if (positions.length > this.props.trailSettings.length) {
            clusterObject.trailPositions.shift();
          }

          positions.push(new THREE.Vector3(center.x, center.y, 0));
        }
      });
    }

    updatePositions(zoom: number) {
      if (!this.scene || !this.lineMesh || !this.props.workspace) {
        return;
      }

      this.lineMesh.geometry.dispose();
      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices = [];
      lineGeometry.faces = [];
      lineGeometry.colors = [];

      let index = 0;

      const activeStory = AStorytelling.getActive(this.props.stories);
      this.clusterObjects.forEach((clusterObject) => {
        const { cluster } = clusterObject;
        const center = ACluster.getCenterFromWorkspace(this.props.workspace, activeStory.clusters.entities[cluster]);
        const { mesh } = clusterObject;

        mesh.position.set(center.x * zoom, center.y * zoom, -0.5);

        mesh.material.color = this.getColorForClusterObject(clusterObject);

        mesh.scale.set(this.props.globalPointSize[0], this.props.globalPointSize[0], this.props.globalPointSize[0]);

        clusterObject.children.forEach((child) => {
          if (child.visible && this.props.displayMode === DisplayMode.StatesAndClusters) {
            const { x, y } = this.props.workspace[child.sample];
            const dir = new THREE.Vector2(x - center.x, y - center.y).normalize();
            const rigth = new Vector2(dir.y, -dir.x).multiplyScalar(this.devicePixelRatio);
            const left = new Vector2(-dir.y, dir.x).multiplyScalar(this.devicePixelRatio);

            lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + left.x, center.y * zoom + left.y, 0));
            lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + rigth.x, center.y * zoom + rigth.y, 0));
            lineGeometry.vertices.push(new THREE.Vector3(x * zoom + left.x, y * zoom + left.y, 0));
            lineGeometry.vertices.push(new THREE.Vector3(x * zoom + rigth.x, y * zoom + rigth.y, 0));

            const i = index * 4;
            lineGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)));
            lineGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)));

            index += 1;
          }
        });
      });

      this.lineMesh.geometry = lineGeometry;
    }

    /**
     * Creates the visualization.
     */
    create() {
      this.clusterObjects = [];

      const lineMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true });

      lineMateral.opacity = 0.5;
      lineMateral.transparent = true;
      const lineGeometry = new THREE.Geometry();
      this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral);
      this.lineMesh.position.set(0, 0, -1);
      this.scene.add(this.lineMesh);

      const activeStory = AStorytelling.getActive(this.props.stories);

      for (const [ci, cluster] of Object.entries(activeStory.clusters.entities)) {
        // Add circle to scene
        const geometry = new THREE.PlaneGeometry(this.devicePixelRatio * CLUSTER_PIXEL_SIZE, this.devicePixelRatio * CLUSTER_PIXEL_SIZE);
        geometry.rotateZ(Math.PI / 4);
        geometry.scale(0.85, 1.0, 1.0);

        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(DEFAULT_COLOR) });
        const circle = new THREE.Mesh(geometry, material);

        material.opacity = 0.92;

        material.transparent = true;

        const center = ACluster.getCenterFromWorkspace(this.props.workspace, cluster);
        circle.position.set(center.x, center.y, 0);
        this.clusterScene.add(circle);

        const clusterObject: ClusterObjectType = {
          cluster: ci,
          geometry,
          material,
          mesh: circle,
          children: [],
          trailPositions: [],
          lineColor: new SchemeColor(DEFAULT_COLOR),
          triangulatedMesh: {},
          sampleConnection: false,
        };

        material.color = this.getColorForClusterObject(clusterObject);

        this.clusterObjects.push(clusterObject);

        // Create line geometry
        cluster.indices.forEach((i) => {
          clusterObject.children.push({
            sample: i,
            visible: false,
          });
        });
      }
    }

    // Activates the lines from given samples to their corresponding clusters
    highlightSamples(samples: IVector[]) {
      // Deactivate all lines
      this.deactivateAll();

      const activeStory = AStorytelling.getActive(this.props.stories);

      this.clusterObjects.forEach((clusterObject) => {
        clusterObject.material.color = new THREE.Color(DEFAULT_COLOR);
      });

      samples.forEach((sample) => {
        sample.groupLabel.forEach((label) => {
          const clusterObject = this.clusterObjects.find((e) => activeStory.clusters.entities[e.cluster].label === label);

          if (clusterObject && this.props.groupVisualizationMode === GroupVisualizationMode.StarVisualization) {
            clusterObject.sampleConnection = true;

            clusterObject.children.forEach((child) => {
              if (child.sample === sample.__meta__.meshIndex) {
                child.visible = true;
              }
            });
          }
        });
      });
    }

    deactivateAll() {
      this.clusterObjects.forEach((clusterObject) => {
        clusterObject.sampleConnection = false;

        clusterObject.material.color = this.getColorForClusterObject(clusterObject);

        clusterObject.children.forEach((child) => {
          child.visible = false;
        });
      });
      if (this.clusterVis) {
        this.clusterVis.forEach((mesh) => {
          mesh.visible = false;
        });
      }
    }

    highlightCluster(indices?: EntityId[]) {
      this.clusterObjects.forEach((clusterObject, index) => {
        const visible = indices?.includes(clusterObject.cluster); // for paper used: true

        clusterObject.material.color = visible ? new THREE.Color(SELECTED_COLOR) : new THREE.Color(DEFAULT_COLOR);

        if (this.props.groupVisualizationMode === GroupVisualizationMode.StarVisualization) {
          clusterObject.children.forEach((child) => {
            child.visible = visible;
          });
        }

        if (this.clusterVis && this.props.groupVisualizationMode === GroupVisualizationMode.ConvexHull) {
          this.clusterVis[index].visible = visible;
        }
      });
    }

    /**
     * Destroys the visualization.
     */
    destroy() {
      if (this.clusterObjects && this.clusterObjects.length > 0) {
        this.clusterObjects.forEach((clusterObject) => {
          this.clusterScene.remove(clusterObject.mesh);
          clusterObject.geometry.dispose();
          clusterObject.material.dispose();
        });
        this.clusterObjects = [];
      }

      if (this.lineMesh) {
        this.scene.remove(this.lineMesh);

        const lineMaterial = this.lineMesh.material as THREE.Material;
        this.lineMesh.geometry.dispose();
        lineMaterial.dispose();
      }
    }

    /**
     * Creates the triangulated mesh that visualizes the clustering.
     * @param clusters an array of clusters
     */
    createTriangulatedMesh() {
      this.disposeTriangulatedMesh();

      if (this.props.groupVisualizationMode !== GroupVisualizationMode.ConvexHull) {
        return;
      }

      const lineMeshes = [];

      if (this.props.stories.active !== null) {
        const activeStory = AStorytelling.getActive(this.props.stories);

        for (const [, cluster] of Object.entries(activeStory.clusters.entities)) {
          const bounds = ACluster.calcBounds(this.props.workspace, cluster.indices);

          const xAxis = d3v5.scaleLinear().range([0, 100]).domain([bounds.left, bounds.right]);

          const yAxis = d3v5
            .scaleLinear()
            .range([0, 100 * (bounds.height / bounds.width)])
            .domain([bounds.top, bounds.bottom]);

          const contours = d3v5
            .contourDensity()
            .x((d) => xAxis(d[0]))
            .y((d) => yAxis(d[1]))
            .bandwidth(10)
            .thresholds(10)
            .size([100, bounds.width === 0 ? 1 : Math.floor(100 * (bounds.height / bounds.width))])(
            cluster.indices.map((i) => [this.props.workspace[i].x, this.props.workspace[i].y]),
          );

          const clusterObject = this.clusterObjects.find((e) => activeStory.clusters.entities[e.cluster].label === cluster.label);

          const material = new THREE.LineBasicMaterial({ color: clusterObject.lineColor.hex });

          const points = [];
          contours.forEach((contour) => {
            contour.coordinates.forEach((contourPolygon) => {
              const coordinates = contourPolygon[0];

              for (let i = 0; i < coordinates.length - 1; i++) {
                const cur = coordinates[i];
                const next = coordinates[i + 1];

                points.push(new THREE.Vector3(xAxis.invert(cur[0]), yAxis.invert(cur[1]), -5));
                points.push(new THREE.Vector3(xAxis.invert(next[0]), yAxis.invert(next[1]), -5));
              }
            });
          });
          const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material);

          line.visible = this.props.currentAggregation.source === 'cluster' && this.props.currentAggregation.selectedClusters.includes(clusterObject.cluster);

          this.scalingScene.add(line);

          lineMeshes.push(line);
        }
      }

      this.clusterVis = lineMeshes;
    }

    /**
     * Destroys the triangulated view of the clusters.
     */
    disposeTriangulatedMesh() {
      if (this.clusterVis != null) {
        const lineMeshes = this.clusterVis;
        lineMeshes?.forEach((mesh) => {
          mesh.geometry.dispose();
          mesh.material.dispose();
          this.scalingScene.remove(mesh);
        });

        this.clusterVis = null;
      }
    }

    /**
     * Creates textual representations of the edges of the story.
     */
    createStreetLabels(story?: IBook) {
      if (!story) {
        return [];
      }
      console.log(story);
      const labels = [];

      Object.values(story.edges.entities)
        .filter((edge) => edge.name && edge.name !== '')
        .forEach((edge) => {
          console.log(edge);
          const source = CameraTransformations.worldToScreen(
            ACluster.getCenterFromWorkspace(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.source)),
            this.props.viewTransform,
          );
          const dest = CameraTransformations.worldToScreen(
            ACluster.getCenterFromWorkspace(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.destination)),
            this.props.viewTransform,
          );

          let angle = new nt.VectBase(dest.x - source.x, dest.y - source.y).angle();
          if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
            angle -= Math.PI;
          }

          // Only display edge name if it can fit inside the viewport
          if (nt.euclideanDistanceVec(source, dest) > edge.name.length * 10) {
            labels.push(
              <Typography
                style={{
                  position: 'absolute',
                  left: (source.x + dest.x) / 2,
                  top: (source.y + dest.y) / 2,
                  background: 'transparent',
                  color: 'black',
                  transform: `translate(-50%, 0px) rotateZ(${angle}rad) translate(0, -25px)`,
                  pointerEvents: 'none',
                }}
              >
                {edge.name}
              </Typography>,
            );
          }
        });

      return labels;
    }

    /**
     * Render an empty div, so componentDidMount will get called.
     */
    render() {
      const activeStory = AStorytelling.getActive(this.props.stories);

      return (
        <div>
          {this.props.stories.active !== null && this.createStreetLabels(activeStory)}

          {this.props.hoverState.data &&
            isCluster(this.props.hoverState.data) &&
            // this.props.hoverState.data.name &&
            hoverLabel(this.props.hoverState.data as ICluster, this.props.viewTransform, this.props.workspace)}

          {this.props.stories.trace &&
            this.props.stories.trace.mainPath.map((cluster) => {
              const clusterInstance = AStorytelling.retrieveCluster(this.props.stories, cluster);

              const screen = CameraTransformations.worldToScreen(
                ACluster.getCenterFromWorkspace(this.props.workspace, clusterInstance),
                this.props.viewTransform,
              );

              return (
                <Typography
                  key={cluster}
                  style={{
                    textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
                    position: 'absolute',
                    left: screen.x,
                    top: screen.y,
                    background: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                >
                  {clusterInstance.label}
                </Typography>
              );
            })}
        </div>
      );
    }
  },
);
