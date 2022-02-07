/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable operator-assignment */
/* eslint-disable no-empty */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import * as THREE from 'three';
import { connect, ConnectedProps } from 'react-redux';
import { Camera } from 'three';
import { Menu, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultZoom, arraysEqual, normalizeWheel, interpolateLinear } from './UtilityFunctions';
import { LassoSelection } from './tools';
import { LassoLayer } from './LassoLayer';
import { ACluster, isCluster } from '../../model/Cluster';
import { ICluster } from '../../model/ICluster';
import { TypedObject } from '../../model/TypedObject';
import { isVector, IVector } from '../../model/Vector';
import { setViewTransform, ViewTransformType } from '../Ducks/ViewTransformDuck';
import { selectClusters, selectVectors } from '../Ducks/AggregationDuck';
import { CameraTransformations } from './CameraTransformations';
import { LineVisualization, PointVisualization } from './meshes';
import { MultivariateClustering } from './MultivariateClustering';
import { DisplayMode, displayModeSupportsStates } from '../Ducks/DisplayModeDuck';
import { setActiveLine } from '../Ducks/ActiveLineDuck';
import { mappingFromScale } from '../Utility/Colors/colors';
import { setPointColorMapping } from '../Ducks/PointColorMappingDuck';
import type { RootState } from '../Store/Store';
import * as nt from '../NumTs/NumTs';
import { MouseController } from './MouseController';
import { IBook, ABook } from '../../model/Book';
import { RenderingContextEx } from '../Utility/RenderingContextEx';
import { IEdge, isEdge } from '../../model/Edge';
import { getSyncNodesAlt } from '../NumTs/NumTs';
import { ClusterDragTool } from './ClusterDragTool';
import { TraceSelectTool } from './TraceSelectTool';
import { setOpenTabAction } from '../Ducks/OpenTabDuck';
import { setHoverState } from '../Ducks/HoverStateDuck';
import { pointInHull } from '../Utility/Geometry/Intersection';
import { ADataset } from '../../model/Dataset';
import { DataLine } from '../../model/DataLine';
import { ObjectTypes } from '../../model/ObjectType';
import { ComponentConfig } from '../../BaseConfig';
import { ANormalized } from '../Utility/NormalizedState';
import { StoriesActions, AStorytelling } from '../Ducks/StoriesDuck copy';

type ViewState = {
  camera: Camera;
  menuX: number;
  menuY: number;
  menuTarget: TypedObject;
};

const mapStateToProps = (state: RootState) => ({
  currentAggregation: state.currentAggregation,
  vectorByShape: state.vectorByShape,
  dataset: state.dataset,
  highlightedSequence: state.highlightedSequence,
  activeLine: state.activeLine,
  advancedColoringSelection: state.advancedColoringSelection,
  clusterMode: state.clusterMode,
  displayMode: state.displayMode,
  lineBrightness: state.lineBrightness,
  pathLengthRange: state.pathLengthRange,
  globalPointSize: state.globalPointSize,
  globalPointBrightness: state.globalPointBrightness,
  channelSize: state.channelSize,
  channelColor: state.channelColor,
  channelBrightness: state.channelBrightness,
  stories: state.stories,
  trailSettings: state.trailSettings,
  hoverState: state.hoverState,
  workspace: state.projections.workspace,
  colorScales: state.colorScales,
  pointDisplay: state.pointDisplay,
  // viewTransform: state.viewTransform
});

const mapDispatchToProps = (dispatch) => ({
  selectVectors: (vectors: number[], shiftKey: boolean) => dispatch(selectVectors(vectors, shiftKey)),
  setActiveLine: (activeLine) => dispatch(setActiveLine(activeLine)),
  setViewTransform: (camera, width, height) => dispatch(setViewTransform(camera, width, height)),
  setHoverState: (hoverState, updater) => dispatch(setHoverState(hoverState, updater)),
  setPointColorMapping: (mapping) => dispatch(setPointColorMapping(mapping)),
  removeClusterFromStories: (cluster: ICluster) => dispatch(StoriesActions.deleteCluster({ cluster })),
  addStory: (book: IBook, activate: boolean) => dispatch(StoriesActions.addBookAsync({ book, activate })),
  addClusterToStory: (cluster: ICluster) => dispatch(StoriesActions.addCluster({ cluster })),
  addEdgeToActive: (edge: IEdge) => dispatch(StoriesActions.addEdgeToActive(edge)),
  setActiveTrace: (trace) => dispatch(StoriesActions.setActiveTrace(trace)),
  setOpenTab: (tab) => dispatch(setOpenTabAction(tab)),
  setSelectedCluster: (clusters: string[], shiftKey: boolean) => dispatch(selectClusters(clusters, shiftKey)),
  removeEdgeFromActive: (edge) => dispatch(StoriesActions.removeEdgeFromActive(edge)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  overrideComponents: ComponentConfig;
};

const UPDATER = 'scatter';

export const WebGLView = connector(
  class extends React.Component<Props, ViewState> {
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

    targetPosition: { x: number; y: number };

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

    multivariateClusterView: any = React.createRef();

    invalidated: boolean;

    mouseController: MouseController = new MouseController();

    constructor(props) {
      super(props);

      this.containerRef = React.createRef();
      this.selectionRef = React.createRef();
      this.physicsRef = React.createRef();

      this.initMouseController();

      this.mouse = { x: 0, y: 0 };

      this.currentHover = null;

      this.state = {
        // clusters to display using force-directed layout
        camera: null,
        menuX: null,
        menuY: null,
        menuTarget: null,
      };
    }

    chooseCluster(screenPosition: { x: number; y: number }): ICluster {
      let nearest: ICluster = null;
      let min = Number.MAX_SAFE_INTEGER;

      const activeStory = AStorytelling.getActive(this.props.stories);

      if (!activeStory) {
        return null;
      }

      for (const [key, cluster] of Object.entries(activeStory.clusters.entities)) {
        const clusterScreen = CameraTransformations.worldToScreen(
          new THREE.Vector2(ACluster.getCenterFromWorkspace(this.props.workspace, cluster).x, ACluster.getCenterFromWorkspace(this.props.workspace, cluster).y),
          this.createTransform(),
        );
        const dist = nt.euclideanDistance(screenPosition.x, screenPosition.y, clusterScreen.x, clusterScreen.y);

        if (dist < min && dist < 16) {
          nearest = cluster;
          min = dist;
        }
      }

      return nearest;
    }

    chooseEdge(position) {
      if (this.props.stories.active === null) {
        return null;
      }

      const activeStory = AStorytelling.getActive(this.props.stories);

      position = CameraTransformations.screenToWorld(position, this.createTransform());

      for (const edge of Object.values(activeStory.edges.entities)) {
        const a = ACluster.getCenterAsVector2(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.source));
        const b = ACluster.getCenterAsVector2(this.props.workspace, AStorytelling.retrieveCluster(this.props.stories, edge.destination));
        const dir = b.clone().sub(a.clone()).normalize();
        const l = new THREE.Vector2(-dir.y, dir.x).multiplyScalar(0.5);
        const r = new THREE.Vector2(dir.y, -dir.x).multiplyScalar(0.5);

        const hull = [a.clone().add(l), b.clone().add(l), b.clone().add(r), a.clone().add(r)];

        if (pointInHull(position, hull)) {
          return edge;
        }
      }

      return null;
    }

    /**
     * Gives the index of the nearest sample.
     *
     * @param position - The position to pick a sample from
     * @returns The index of a sample
     */
    choose(position) {
      let best = 30 / (this.camera.zoom * 2.0);
      let res = -1;

      for (let index = 0; index < this.props.dataset.vectors.length; index++) {
        const value = this.props.workspace[index];

        // Skip points matching some criteria
        if (!this.particles.isPointVisible(this.props.dataset.vectors[index])) {
          continue;
        }

        const d = nt.euclideanDistance(position.x, position.y, value.x, value.y);

        if (d < best) {
          best = d;
          res = index;
        }
      }
      return res;
    }

    /**
     * Converts mouse coordinates to world coordinates.
     * @param {*} event a dom mouse event.
     */
    relativeMousePosition(event) {
      const rect = this.containerRef.current.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    componentDidMount() {
      this.initializeContainerEvents();
      this.setupRenderer();
      this.startRendering();
    }

    normaliseMouse(event) {
      const vec = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
      return vec;
    }

    resize(width, height) {
      this.camera.left = width / -2;

      this.camera.right = width / 2;
      this.camera.top = height / 2;
      this.camera.bottom = height / -2;

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);

      this.props.setViewTransform(this.camera, width, height);

      this.requestRender();
    }

    onKeyDown(event) {}

    onMouseLeave(event) {
      event.preventDefault();
      if (this.props.dataset) this.mouseController.mouseLeave(event);
    }

    onMouseDown(event) {
      event.preventDefault();
      if (this.props.dataset) this.mouseController.mouseDown(event);
    }

    onMouseMove(event) {
      event.preventDefault();
      if (this.props.dataset) this.mouseController.mouseMove(event);
    }

    onMouseUp(event: MouseEvent) {
      event.preventDefault();
      if (this.props.dataset) this.mouseController.mouseUp(event);
    }

    clearSelection() {
      this.lasso = null;

      if (this.props.dataset.isSequential) {
        this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);

        this.lines.groupHighlight([]);
      } else {
        this.particles.groupHighlight([]);
      }

      this.props.dataset.vectors.forEach((vector, index) => {
        vector.__meta__.selected = false;
      });

      this.props.selectVectors([], false);

      this.particles?.updateColor();
    }

    onWheel(event) {
      event.preventDefault();

      if (!this.props.dataset) {
        return;
      }

      const normalized = normalizeWheel(event);

      // Store world position under mouse
      const bounds = this.containerRef.current.getBoundingClientRect();
      const worldBefore = CameraTransformations.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }, this.createTransform());
      const screenBefore = this.relativeMousePosition(event);

      const newZoom = this.camera.zoom - (normalized.pixelY * 0.013) / this.props.dataset.bounds.scaleFactor;
      if (newZoom < 1.0 / this.props.dataset.bounds.scaleFactor) {
        this.camera.zoom = 1.0 / this.props.dataset.bounds.scaleFactor;
      } else {
        this.camera.zoom = newZoom;
      }

      // Restore camera position
      this.restoreCamera(worldBefore, screenBefore);

      // Adjust mesh zoom levels
      this.particles.zoom(this.camera.zoom);

      if (this.props.dataset.isSequential) {
        this.lines.setZoom(this.camera.zoom);
      }

      // Update projection matrix
      this.camera.updateProjectionMatrix();

      this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());

      this.requestRender();
    }

    restoreCamera(world, screen) {
      this.camera.position.x = world.x - (screen.x - this.getWidth() / 2) / this.camera.zoom;
      this.camera.position.y = world.y + (screen.y - this.getHeight() / 2) / this.camera.zoom;
    }

    getWidth() {
      return this.containerRef.current?.offsetWidth;
    }

    getHeight() {
      return this.containerRef.current?.offsetHeight;
    }

    /**
     * Initializes the callbacks for the MouseController.
     */
    initMouseController() {
      this.mouseController.onMouseLeave = (event: MouseEvent) => {
        if (this.infoTimeout != null) {
          clearTimeout(this.infoTimeout);
        }

        this.particles?.highlight(null);

        if (this.props.dataset?.isSequential) {
          this.lines?.highlight([], this.getWidth(), this.getHeight(), this.scene);
        }

        if (this.currentHover) {
          this.currentHover = null;
          this.props.setHoverState(null, UPDATER);
          this.requestRender();
        }
      };

      this.mouseController.onDragStart = (event: MouseEvent, button: number, initial: nt.VectorType) => {
        switch (button) {
          case 0: {
            // Check if we have dragged from a cluster
            const cluster = this.chooseCluster(initial);
            if (cluster) {
              // Initiate action to let user drag an arrow to other cluster
              this.clusterDrag = new ClusterDragTool(cluster);
            } else {
              // Initiate lasso selection
              const initialWorld = CameraTransformations.screenToWorld(initial, this.createTransform());

              this.lasso = new LassoSelection();
              this.lasso.mouseDown(true, initialWorld.x, initialWorld.y);
            }
            break;
          }
          default:
            break;
        }
      };

      this.mouseController.onDragEnd = (event: MouseEvent, button: number) => {
        switch (button) {
          case 0: {
            const coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform());

            // In case we dragged a cluster... connect them
            if (this.clusterDrag) {
              const cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY });

              if (cluster) {
                const activeStory = AStorytelling.getActive(this.props.stories);

                const source = Object.keys(activeStory.clusters.entities).find((key) => activeStory.clusters.entities[key] === this.clusterDrag.cluster);
                const destination = Object.keys(activeStory.clusters.entities).find((key) => activeStory.clusters.entities[key] === cluster);

                if (
                  activeStory.edges.ids.map((id) => activeStory.edges.entities[id]).find((e) => e.source === source && e.destination === destination) ===
                  undefined
                ) {
                  this.props.addEdgeToActive({
                    id: uuidv4(),
                    source,
                    destination,
                    objectType: ObjectTypes.Edge,
                  });
                }
              }

              this.clusterDrag = null;
            }

            // In case we have a lasso, select states
            if (this.lasso) {
              // If there is an active lasso, process it
              const wasDrawing = this.lasso.drawing;

              this.lasso.mouseUp(coords.x, coords.y);

              const indices = this.lasso.selection(this.props.dataset, this.props.workspace, (vector) => this.particles.isPointVisible(vector));
              if (indices.length > 0 && wasDrawing && displayModeSupportsStates(this.props.displayMode)) {
                this.props.selectVectors(indices, event.ctrlKey);

                this.props.setOpenTab(4);
              } else if (wasDrawing) {
                this.clearSelection();
              }

              this.lasso = null;
            }
            break;
          }
          default:
            break;
        }
      };

      this.mouseController.onDragMove = (event: MouseEvent, button: number) => {
        switch (button) {
          case 0: {
            const coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform());
            this.lasso?.mouseMove(coords.x, coords.y);
            break;
          }
          case 2: {
            this.camera.position.x = this.camera.position.x - CameraTransformations.pixelToWorldCoordinates(event.movementX, this.createTransform());
            this.camera.position.y = this.camera.position.y + CameraTransformations.pixelToWorldCoordinates(event.movementY, this.createTransform());

            this.camera.updateProjectionMatrix();
            this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());

            this.requestRender();
            break;
          }
          default:
            break;
        }
      };

      this.mouseController.onContext = (event: MouseEvent, button: number) => {
        switch (button) {
          case 0:
            if (this.props.activeLine) {
              break;
            }

            if (this.traceSelect) {
              const target = this.chooseCluster({ x: event.offsetX, y: event.offsetY });

              if (target) {
                const activeStory = AStorytelling.getActive(this.props.stories);
                // We want to select a trace between 2 clusters
                const paths = ABook.depthFirstSearch(
                  ABook.toGraph(activeStory),
                  Object.entries(activeStory.clusters.entities).find(([key, value]) => value === this.traceSelect.cluster)[0],
                  Object.entries(activeStory.clusters.entities).find(([key, value]) => value === target)[0],
                );

                if (paths.length > 0) {
                  const mainPath = paths[0];
                  const mainEdges = mainPath.slice(1).map((item, index) => {
                    const [resultEdgeKey, _] = Object.entries(activeStory.edges.entities).find(
                      ([key, edge]) => edge.source === mainPath[index] && edge.destination === item,
                    );
                    return resultEdgeKey;
                  });
                  this.props.setActiveTrace({
                    mainPath,
                    mainEdges,
                    sidePaths: paths.slice(1).map((ids) => {
                      const path = ids;
                      const edges = path.slice(1).map((item, index) => {
                        const [resultEdgeKey, _] = Object.entries(activeStory.edges.entities).find(
                          ([key, edge]) => edge.source === path[index] && edge.destination === item,
                        );
                        return resultEdgeKey;
                      });
                      return {
                        nodes: path,
                        edges,
                        syncNodes: getSyncNodesAlt(mainPath, path),
                      };
                    }),
                  });
                }
              }

              this.traceSelect = null;
            } else if (this.currentHover && isVector(this.currentHover)) {
              // We click on a hover target
              this.props.selectVectors([this.currentHover.__meta__.meshIndex], event.ctrlKey);
            } else if (this.currentHover && isCluster(this.currentHover)) {
              const activeStory = AStorytelling.getActive(this.props.stories);
              this.props.setSelectedCluster(
                [Object.keys(activeStory.clusters.entities).find((key) => activeStory.clusters.entities[key] === this.currentHover)],
                event.ctrlKey,
              );
            }

            break;
          case 2: {
            const cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY });

            if (cluster) {
              this.setState({
                menuX: event.clientX,
                menuY: event.clientY,
                menuTarget: cluster,
              });
            } else {
              const edge = this.chooseEdge(this.mouseController.currentMousePosition);
              if (edge) {
                this.setState({
                  menuX: event.clientX,
                  menuY: event.clientY,
                  menuTarget: edge,
                });
              } else {
                this.setState({
                  menuX: event.clientX,
                  menuY: event.clientY,
                  menuTarget: null,
                });
              }
            }

            break;
          }
          default:
            break;
        }
      };

      this.mouseController.onMouseUp = (event: MouseEvent) => {};

      this.mouseController.onMouseMove = (event: MouseEvent) => {
        if (this.props.displayMode === DisplayMode.OnlyClusters) {
          return;
        }

        // In case we have a line in the sequence UI
        if (this.props.activeLine) {
          return;
        }

        if (this.infoTimeout != null) {
          clearTimeout(this.infoTimeout);
        }

        this.infoTimeout = setTimeout(() => {
          this.infoTimeout = null;

          const cluster = this.chooseCluster(this.mouseController.currentMousePosition);
          if (cluster) {
            if (this.currentHover !== cluster) {
              this.currentHover = cluster;
              this.props.setHoverState(cluster, UPDATER);

              if (this.props.dataset.isSequential) {
                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
              }
              this.particles.highlight(-1);

              this.requestRender();
            }
          } else {
            const coords = CameraTransformations.screenToWorld(this.mouseController.currentMousePosition, this.createTransform());

            const edge = this.chooseEdge(this.mouseController.currentMousePosition);

            if (edge) {
              if (this.currentHover !== edge) {
                this.currentHover = edge;
                this.props.setHoverState(edge, UPDATER);
              }
            } else {
              // Get index of selected node
              const idx = this.choose(coords);
              this.particles.highlight(idx);

              if (this.props.dataset.isSequential) {
                if (idx >= 0) {
                  this.lines.highlight([this.props.dataset.vectors[idx].line], this.getWidth(), this.getHeight(), this.scene);
                } else {
                  this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
                }
              }

              if (idx >= 0) {
                if (this.currentHover !== this.props.dataset.vectors[idx]) {
                  this.currentHover = this.props.dataset.vectors[idx];

                  this.props.setHoverState(this.props.dataset.vectors[idx], UPDATER);
                  this.requestRender();
                }
              } else if (this.currentHover) {
                this.currentHover = null;
                this.props.setHoverState(null, UPDATER);
                this.requestRender();
              }
            }
          }
        }, 10);
      };
    }

    setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.renderer.autoClear = true;
      this.renderer.autoClearColor = false;

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.getWidth(), this.getHeight());
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.sortObjects = false;

      this.camera = new THREE.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2, 1, 1000);
      this.camera.position.z = 1;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      // this.camera.position.x = this.props.viewTransform.centerX
      // this.camera.position.y = this.props.viewTransform.centerY
      // this.camera.zoom = this.props.viewTransform.zoom

      this.camera.updateProjectionMatrix();

      this.containerRef.current.appendChild(this.renderer.domElement);

      this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());

      this.prevTime = performance.now();
    }

    createVisualization(dataset, lineColorScheme, vectorColorScheme) {
      this.disposeScene();

      this.scene = new THREE.Scene();
      this.pointScene = new THREE.Scene();
      this.segments = dataset.segments;
      this.lineColorScheme = lineColorScheme;
      this.vectorColorScheme = vectorColorScheme;

      // Update camera zoom to fit the problem
      this.camera.zoom = getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight());
      this.camera.position.x = 0.0;
      this.camera.position.y = 0.0;
      this.camera.updateProjectionMatrix();

      this.setState({
        camera: this.camera,
      });

      if (this.props.dataset.isSequential) {
        this.lines = new LineVisualization(this.segments, this.lineColorScheme);
        this.lines.createMesh(this.props.lineBrightness);
        this.lines.setZoom(this.camera.zoom);

        // First add lines, then particles
        this.lines.meshes.forEach((line) => this.scene.add(line.line));
      }

      this.particles = new PointVisualization(
        this.vectorColorScheme,
        this.props.dataset,
        window.devicePixelRatio * 8,
        this.lines?.grayedLayerSystem,
        this.segments,
      );
      this.particles.createMesh(this.props.dataset.vectors, this.segments, () => {
        this.requestRender();
      });
      this.particles.zoom(this.camera.zoom);
      this.particles.update();

      // this.scene.add(this.particles.mesh);
      this.pointScene.add(this.particles.mesh);
    }

    initializeContainerEvents() {
      const container = this.containerRef.current;
      // Remove old listeners
      container.removeEventListener('mousemove', this.mouseMoveListener);
      container.removeEventListener('mousedown', this.mouseDownListener);
      container.removeEventListener('mouseup', this.mouseUpListener);
      container.removeEventListener('keydown', this.keyDownListener);
      container.removeEventListener('wheel', this.wheelListener);

      // Store new listeners
      this.wheelListener = (event) => this.onWheel(event);
      this.mouseDownListener = (event) => this.onMouseDown(event);
      this.mouseMoveListener = (event) => this.onMouseMove(event);
      this.mouseUpListener = (event) => this.onMouseUp(event);
      this.keyDownListener = (event) => this.onKeyDown(event);

      // Add new listeners
      container.addEventListener('mousemove', this.mouseMoveListener, false);
      container.addEventListener('mousedown', this.mouseDownListener, false);
      container.addEventListener('mouseup', this.mouseUpListener, false);
      container.addEventListener('keydown', this.keyDownListener);
      container.addEventListener('wheel', this.wheelListener, false);

      // @ts-ignore
      new ResizeObserver(() => {
        this.resize(container.offsetWidth, container.offsetHeight);
      }).observe(container);
    }

    filterLines(algo, show) {
      this.segments.forEach((segment) => {
        if (segment.vectors[0].algo === algo) {
          segment.__meta__.globalVisible = show;

          segment.vectors.forEach((vector) => {
            vector.__meta__.visible = show;
          });
        }
      });

      this.lines.update();
      this.particles.update();
    }

    /**
     *
     * @param checked
     */
    setLineFilter(checked) {
      this.segments.forEach((segment) => {
        const show = checked[segment.vectors[0].line];
        segment.__meta__.detailVisible = show;
      });
      this.lines.update();
      this.particles.update();
    }

    /**
     * Updates the x,y coordinates of the visualization only. This will also
     * recalculate the optimal camera zoom level.
     */
    updateXY() {
      if (this.props.workspace) {
        this.particles.updatePosition(this.props.workspace);

        if (this.props.dataset.isSequential) {
          this.lines.updatePosition(this.props.workspace);
        }

        ADataset.calculateBounds(this.props.dataset);

        this.camera.zoom = getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight());
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.updateProjectionMatrix();

        this.repositionClusters();

        this.requestRender();
      }
    }

    filterPoints(checkboxes) {
      this.particles.showSymbols = checkboxes;
      this.particles.update();
    }

    disposeScene() {
      this.currentHover = null;

      if (this.lines != null && this.scene != null) {
        this.lines.dispose(this.scene);
        this.lines = null;
      }

      if (this.particles != null && this.scene != null) {
        this.scene.remove(this.particles.mesh);
        this.particles.dispose();
        this.particles = null;
      }

      if (this.renderer != null) {
        this.renderer.renderLists.dispose();
      }
    }

    /**
     * Starts the render loop
     */
    startRendering() {
      requestAnimationFrame(() => this.startRendering());

      try {
        this.renderLoop();
      } catch {}
    }

    updateZoom(deltaTime) {
      if (this.targetPosition != null && this.targetZoom != null) {
        // Update transition time, maxing at 1
        this.transitionTime = Math.min(this.transitionTime + deltaTime, 1);

        // Update zoom level and position
        this.camera.position.x = interpolateLinear(this.sourcePosition.x, this.targetPosition.x, this.transitionTime);
        this.camera.position.y = interpolateLinear(this.sourcePosition.y, this.targetPosition.y, this.transitionTime);
        // this.camera.zoom = interpolateLinear(this.sourceZoom, this.targetZoom, this.transitionTime)
        this.camera.updateProjectionMatrix();

        this.requestRender();

        // End transition
        if (this.transitionTime === 1) {
          this.sourcePosition = null;
          this.sourceZoom = null;
          this.targetPosition = null;
          this.targetZoom = null;
          this.transitionTime = 0;
        }
      }
    }

    /**
     * Render function that gets called with the display refresh rate.
     * Only render overlays here like the lasso selection etc.
     * The rendering of the states + lines and stuff that does not need to be
     * re-rendered for animations should be put in 'requestRender'
     */
    renderLoop() {
      const ctx = this.selectionRef.current.getContext() as CanvasRenderingContext2D;
      const extended = new RenderingContextEx(ctx, window.devicePixelRatio);
      ctx.clearRect(0, 0, this.getWidth(), this.getHeight());

      this.selectionRef.current.setDimensions(this.getWidth() * window.devicePixelRatio, this.getHeight() * window.devicePixelRatio);

      this.renderLasso(ctx);

      if (this.clusterDrag) {
        this.clusterDrag.renderToContext(
          extended,
          CameraTransformations.worldToScreen(ACluster.getCenterFromWorkspace(this.props.workspace, this.clusterDrag.cluster), this.createTransform()),
          this.mouseController.currentMousePosition,
        );
      }

      if (this.traceSelect) {
        this.traceSelect.viewTransform = this.createTransform();
        this.traceSelect.mousePosition = this.mouseController.currentMousePosition;
        this.traceSelect.renderToContext(extended);
      }

      if (this.props.highlightedSequence != null) {
        this.selectionRef.current.renderHighlightedSequence(ctx, this.props.highlightedSequence);
      }
    }

    onClusterClicked(cluster: ICluster, shiftKey = false) {
      const activeStory = AStorytelling.getActive(this.props.stories);
      this.props.setSelectedCluster([Object.keys(activeStory.clusters.entities).find((key) => activeStory.clusters.entities[key] === cluster)], shiftKey);
    }

    renderFrame() {
      this.invalidated = false;

      // Calculate delta time
      const nextTime = performance.now();
      const deltaTime = (nextTime - this.lastTime) / 1000;
      this.lastTime = nextTime;

      // Update zoom in case a target has been set
      this.updateZoom(deltaTime);

      try {
        const camera = new THREE.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2, 1, 1000);
        camera.lookAt(0, 0, 0);
        camera.position.z = 1;
        camera.position.x = this.camera.position.x * this.camera.zoom;
        camera.position.y = this.camera.position.y * this.camera.zoom;
        // camera.position.x = this.props.viewTransform.centerX
        // camera.position.y = this.props.viewTransform.centerY
        // camera.zoom = this.props.viewTransform.zoom
        camera.updateProjectionMatrix();

        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        if (this.multivariateClusterView.current) {
          this.multivariateClusterView.current.updatePositions(this.camera.zoom);
          this.multivariateClusterView.current.updateArrows(this.camera.zoom, this.props.stories.active);
          this.multivariateClusterView.current.updateTrail(this.camera.zoom);

          if (this.multivariateClusterView.current.scene) {
            this.renderer.render(this.multivariateClusterView.current.scene, camera);
          }
          if (this.multivariateClusterView.current.scalingScene) {
            this.renderer.render(this.multivariateClusterView.current.scalingScene, this.camera);
          }
        }

        if (this.pointScene) {
          this.renderer.render(this.pointScene, this.camera);
        }

        if (this.multivariateClusterView.current) {
          if (this.multivariateClusterView.current.clusterScene) {
            this.renderer.render(this.multivariateClusterView.current.clusterScene, camera);
          }
        }
      } catch (e) {}
    }

    updateItemClusterDisplay() {
      switch (this.props.displayMode) {
        case DisplayMode.StatesAndClusters:
        case DisplayMode.OnlyStates:
          if (this.props.dataset.isSequential) {
            this.lines.meshes.forEach((line) => {
              this.scene.remove(line.line);
              this.scene.add(line.line);
            });
          }

          this.pointScene.remove(this.particles.mesh);
          this.pointScene.add(this.particles.mesh);
          break;
        case DisplayMode.OnlyClusters:
        case DisplayMode.None:
          if (this.props.dataset.isSequential) {
            this.lines.meshes.forEach((line) => {
              this.scene.remove(line.line);
            });
          }

          this.pointScene.remove(this.particles.mesh);
          break;
        default:
          break;
      }
    }

    componentDidUpdate(prevProps: Props, prevState) {
      if (prevProps.dataset !== this.props.dataset) {
        this.createVisualization(this.props.dataset, mappingFromScale({ type: 'categorical', palette: 'dark2' }, { key: 'algo' }, this.props.dataset), null);
      }

      if (
        prevProps.colorScales.active !== this.props.colorScales.active ||
        prevProps.stories !== this.props.stories ||
        prevProps.channelColor !== this.props.channelColor
      ) {
        if (this.props.channelColor && this.props.colorScales.active) {
          const mapping = mappingFromScale(
            ANormalized.get(this.props.colorScales.scales, this.props.colorScales.active),
            this.props.channelColor,
            this.props.dataset,
          );
          this.props.setPointColorMapping(mapping);
          this.particles.colorCat(this.props.channelColor, mapping);
        } else {
          this.props.setPointColorMapping(null);
          this.particles?.colorCat(null, null);
        }
      }

      if (prevProps.stories !== this.props.stories) {
        if (this.props.stories.active !== null) {
          this.particles?.storyTelling(this.props.stories);

          this.lines?.storyTelling(this.props.stories, this.props.dataset.vectors);
          this.lines?.update();

          this.particles?.update();
          this.particles?.updateColor();
        } else {
          this.particles?.storyTelling(null);

          this.lines?.storyTelling(this.props.stories, this.props.dataset.vectors);
          this.lines?.update();

          this.particles?.update();
          this.particles?.updateColor();
        }
      }

      if (prevProps.globalPointSize !== this.props.globalPointSize && this.particles) {
        this.particles.sizeCat(this.props.channelSize, this.props.globalPointSize);
        this.particles.updateSize();
      }

      if (prevProps.globalPointBrightness !== this.props.globalPointBrightness && this.particles) {
        this.particles.transparencyCat(this.props.channelBrightness, this.props.globalPointBrightness);
        this.particles.updateColor();
        this.particles.update();
      }

      if (prevProps.lineBrightness !== this.props.lineBrightness) {
        this.lines?.setBrightness(this.props.lineBrightness);
      }

      if (prevProps.displayMode !== this.props.displayMode) {
        this.updateItemClusterDisplay();
      }

      if (!arraysEqual(prevProps.currentAggregation.aggregation, this.props.currentAggregation.aggregation)) {
        const vectorSelection = this.props.currentAggregation.aggregation.map((i) => this.props.dataset.vectors[i]);

        if (this.props.dataset.isSequential) {
          const uniqueIndices = [...new Set(vectorSelection.map((vector) => vector.line))];

          this.lines.groupHighlight(uniqueIndices);
        } else {
          this.particles.groupHighlight(this.props.currentAggregation.aggregation);
        }

        this.props.dataset.vectors.forEach((sample) => {
          sample.__meta__.selected = false;
        });
        vectorSelection.forEach((sample) => {
          sample.__meta__.selected = true;
        });

        this.particles.update();
        this.particles.updateColor();
      }

      if (prevProps.hoverState !== this.props.hoverState) {
        const hover_item = this.props.hoverState.data;

        if (isVector(hover_item)) {
          const idx = hover_item.__meta__.meshIndex;

          this.particles.highlight(idx);
          if (this.props.dataset.isSequential) {
            if (idx >= 0) {
              this.lines.highlight([this.props.dataset.vectors[idx].line], this.getWidth(), this.getHeight(), this.scene);
            } else {
              this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
            }
          }
          if (idx >= 0) {
            if (this.currentHover !== this.props.dataset.vectors[idx]) {
              this.currentHover = this.props.dataset.vectors[idx];
              this.requestRender();
            }
          } else if (this.currentHover) {
            this.currentHover = null;
            this.requestRender();
          }
        }
      }

      // Path length range has changed, update view accordingly
      if (this.props.dataset && this.props.dataset.isSequential && prevProps.pathLengthRange !== this.props.pathLengthRange) {
        // Set path length range on all segment views, and update them
        this.lines.pathLengthRange = this.props.pathLengthRange.range;
        this.particles.pathLengthRange = this.props.pathLengthRange.range;

        this.lines.update();
        this.particles.update();
        this.particles.updateColor();
      }

      if (prevProps.vectorByShape !== this.props.vectorByShape && this.particles) {
        this.filterPoints({ star: true, cross: true, circle: true, square: true });
        this.particles.shapeCat(this.props.vectorByShape);
      }

      if (prevProps.pointDisplay.checkedShapes !== this.props.pointDisplay.checkedShapes && this.particles) {
        this.filterPoints(this.props.pointDisplay.checkedShapes);
      }

      if (prevProps.activeLine !== this.props.activeLine) {
        if (this.props.activeLine != null) {
          this.lines.highlight([this.props.activeLine], this.getWidth(), this.getHeight(), this.scene, true);
        } else {
          this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene, true);
          this.particles.update();
          this.particles.updateColor();
        }
      }

      if (prevProps.advancedColoringSelection !== this.props.advancedColoringSelection && this.particles) {
        this.particles.colorFilter(this.props.advancedColoringSelection);
      }

      if (prevProps.workspace !== this.props.workspace) {
        this.updateXY();
      }

      this.requestRender();
    }

    requestRender() {
      if (this.invalidated) {
        return;
      }
      this.invalidated = true;
      requestAnimationFrame(() => this.renderFrame());
    }

    createTransform(): ViewTransformType {
      return {
        centerX: this.camera.position.x,
        centerY: this.camera.position.y,
        width: this.getWidth(),
        height: this.getHeight(),
        zoom: this.camera.zoom,
      };
    }

    renderLasso(ctx) {
      if (this.lasso == null) return;

      const { points } = this.lasso;

      if (points.length <= 1) {
        return;
      }

      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 2 * window.devicePixelRatio;
      ctx.beginPath();
      for (let index = 0; index < points.length; index++) {
        let point = points[index];
        point = CameraTransformations.worldToScreen(point, this.createTransform());

        if (index === 0) {
          ctx.moveTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
        } else {
          ctx.lineTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
        }
      }

      if (!this.lasso.drawing) {
        const conv = CameraTransformations.worldToScreen(points[0], this.createTransform());
        ctx.lineTo(conv.x * window.devicePixelRatio, conv.y * window.devicePixelRatio);
      }

      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    repositionClusters() {
      this.multivariateClusterView?.current.updatePositions(this.camera.zoom);
      this.multivariateClusterView?.current.iterateTrail(this.camera.zoom);
      this.multivariateClusterView?.current.createTriangulatedMesh();
    }

    onClusterZoom(cluster) {
      this.props.setSelectedCluster(cluster, false);
    }

    render() {
      const handleClose = () => {
        this.setState({
          menuX: null,
          menuY: null,
        });
      };

      return (
        <div
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onMouseLeave={(event) => {
            this.onMouseLeave(event);
          }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {
            // Layers which are behind the webgl view
            this.props.overrideComponents?.layers
              ?.filter((layer) => layer.order < 0)
              .map((layer) => {
                return React.isValidElement(layer.component)
                  ? layer.component
                  : React.createElement(layer.component as () => JSX.Element, { key: `layer${layer.order}` });
              })
          }

          <div
            id="container"
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '100%',
              height: '100%',
            }}
            ref={this.containerRef}
            tabIndex={0}
          />

          <LassoLayer ref={this.selectionRef} />

          <MultivariateClustering
            onInvalidate={() => {
              this.requestRender();
            }}
            ref={this.multivariateClusterView}
          />

          {
            // Layers which are in front of the webgl view
            this.props.overrideComponents?.layers
              ?.filter((layer) => layer.order > 0)
              .map((layer) => {
                return React.isValidElement(layer.component)
                  ? layer.component
                  : React.createElement(layer.component as () => JSX.Element, { key: `layer${layer.order}` });
              })
          }

          <Menu
            keepMounted
            open={this.state.menuY !== null && !this.state.menuTarget}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={this.state.menuY !== null && this.state.menuX !== null ? { top: this.state.menuY, left: this.state.menuX } : undefined}
          >
            <MenuItem
              onClick={() => {
                if (this.props.currentAggregation.aggregation.length > 0) {
                  const cluster = ACluster.fromSamples(this.props.dataset, this.props.currentAggregation.aggregation);

                  if (this.props.stories.active === null) {
                    const story: IBook = {
                      id: uuidv4(),
                      clusters: {
                        entities: {
                          [cluster.id]: cluster,
                        },
                        ids: [cluster.id],
                      },
                      edges: {
                        entities: {},
                        ids: [],
                      },
                    };

                    this.props.addStory(story, true);
                  } else {
                    this.props.addClusterToStory(cluster);
                  }
                }

                handleClose();
              }}
            >
              Create Group from Selection
            </MenuItem>

            {this.props.dataset?.isSequential && (
              <MenuItem
                onClick={() => {
                  const coords = CameraTransformations.screenToWorld(
                    { x: this.mouseController.currentMousePosition.x, y: this.mouseController.currentMousePosition.y },
                    this.createTransform(),
                  );
                  console.log(this.props.dataset.isSequential);
                  if (this.props.displayMode === DisplayMode.OnlyClusters) {
                    return;
                  }

                  const idx = this.choose(coords);
                  if (idx >= 0) {
                    const vector = this.props.dataset.vectors[idx];
                    this.props.setActiveLine(vector.line);
                  }
                  handleClose();
                }}
              >
                Investigate Line
              </MenuItem>
            )}

            {this.props.overrideComponents?.contextMenuItems?.map((item) => (
              <MenuItem
                key={item.key}
                onClick={() => {
                  const coords = CameraTransformations.screenToWorld(
                    {
                      x: this.mouseController.currentMousePosition.x,
                      y: this.mouseController.currentMousePosition.y,
                    },
                    this.createTransform(),
                  );
                  item.function(coords);
                  handleClose();
                }}
              >
                {item.title}
              </MenuItem>
            ))}
          </Menu>

          <Menu
            keepMounted
            open={this.state.menuY !== null && isCluster(this.state.menuTarget)}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={this.state.menuY !== null && this.state.menuX !== null ? { top: this.state.menuY, left: this.state.menuX } : undefined}
          >
            <MenuItem
              onClick={() => {
                if (isCluster(this.state.menuTarget)) {
                  this.props.removeClusterFromStories(this.state.menuTarget);
                }

                handleClose();
              }}
            >
              Delete Group
            </MenuItem>

            <MenuItem
              onClick={() => {
                if (!isCluster(this.state.menuTarget)) {
                  handleClose();
                  return;
                }

                const activeStory = AStorytelling.getActive(this.props.stories);

                const paths = ABook.getAllStoriesFromSource(
                  activeStory,
                  Object.entries(activeStory.clusters.entities).find(([key, val]) => val === this.state.menuTarget)[0],
                );

                if (paths.length > 0) {
                  const mainPath = paths[0];
                  const mainEdges = mainPath.slice(1).map((item, index) => {
                    const [resultEdgeKey, _] = Object.entries(activeStory.edges.entities).find(
                      ([key, edge]) => edge.source === mainPath[index] && edge.destination === item,
                    );
                    return resultEdgeKey;
                  });
                  this.props.setActiveTrace({
                    mainPath,
                    mainEdges,
                    sidePaths: paths.slice(1).map((ids) => {
                      const path = ids;
                      const edges = path.slice(1).map((item, index) => {
                        const [resultEdgeKey, _] = Object.entries(activeStory.edges.entities).find(
                          ([key, edge]) => edge.source === path[index] && edge.destination === item,
                        );
                        return resultEdgeKey;
                      });
                      return {
                        nodes: path,
                        edges,
                        syncNodes: getSyncNodesAlt(mainPath, path),
                      };
                    }),
                  });
                }

                handleClose();
              }}
            >
              Stories ... Starting from this Group
            </MenuItem>

            <MenuItem
              onClick={() => {
                if (!isCluster(this.state.menuTarget)) {
                  handleClose();
                  return;
                }

                this.traceSelect = new TraceSelectTool(this.props.workspace, this.state.menuTarget);
                handleClose();
              }}
            >
              Stories ... Between 2 Groups
            </MenuItem>
          </Menu>

          <Menu
            keepMounted
            open={this.state.menuY !== null && isEdge(this.state.menuTarget)}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={this.state.menuY !== null && this.state.menuX !== null ? { top: this.state.menuY, left: this.state.menuX } : undefined}
          >
            <MenuItem
              onClick={() => {
                this.props.removeEdgeFromActive((this.state.menuTarget as IEdge).id);

                handleClose();
              }}
            >
              Delete Edge
            </MenuItem>
          </Menu>
        </div>
      );
    }
  },
);
