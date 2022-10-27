import * as THREE from 'three';
import { Mapping } from '../Utility/Colors/Mapping';
import { DataLine } from '../../model/DataLine';
import { IVector } from '../../model/Vector';
import { Dataset } from '../../model/Dataset';
import { LayeringSystem } from './LayeringSystem';
import { IBaseProjection } from '../../model/ProjectionInterfaces';
import { IStorytelling } from '../Ducks/StoriesDuck';
import { CategoryOption } from './CategoryOptions';
export declare function imageFromShape(value: any): "" | "./textures/sprites/cross.png" | "./textures/sprites/square.png" | "./textures/sprites/circle.png" | "./textures/sprites/star.png";
export declare class LineVisualization {
    segments: DataLine[];
    highlightIndices: any;
    lineColorScheme: any;
    meshes: any;
    zoom: any;
    highlightMeshes: any;
    grayedLayerSystem: LayeringSystem;
    pathLengthRange: any;
    constructor(segments: any, lineColorScheme: any);
    setBrightness(brightness: number): void;
    dispose(scene: any): void;
    setZoom(zoom: any): void;
    groupHighlight(indices: any): void;
    storyTelling(stories: IStorytelling, vectors: IVector[]): void;
    /**
     * Highlights the given lines that correspond to the indices
     *
     * @param {*} indices
     * @param {*} width
     * @param {*} height
     * @param {*} scene
     */
    highlight(indices: any, width: any, height: any, scene: any, grayout?: boolean): void;
    createMesh(lineBrightness: number): any[];
    updatePosition(positions: IBaseProjection): void;
    /**
     * Updates visibility based on settings in the lines
     */
    update(): void;
}
export declare class PointVisualization {
    highlightIndex: any;
    particleSize: any;
    vectorMapping: Mapping;
    dataset: Dataset;
    showSymbols: any;
    colorsChecked: any;
    segments: DataLine[];
    vectors: IVector[];
    vectorSegmentLookup: DataLine[];
    mesh: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
    sizeAttribute: any;
    colorAttribute: any;
    grayedLayerSystem: LayeringSystem;
    lineLayerSystem: LayeringSystem;
    pathLengthRange: any;
    baseSize: number[];
    constructor(vectorMapping: Mapping, dataset: Dataset, size: any, lineLayerSystem: LayeringSystem, segments: any);
    createMesh(data: any, segments: any, onUpload: any): void;
    /**
     * Applies the gray-out effect on the particles based on the given story model
     *
     * @param stories The story model
     */
    storyTelling(stories: IStorytelling): void;
    groupHighlight(samples: number[]): void;
    setPointScaling(pointScaling: any): void;
    /**
     * @param {*} category a feature to select the shape for
     */
    setShapeByChannel(category: CategoryOption): void;
    setColorByChannel(category: CategoryOption, scale: any): void;
    colorFilter(colorsChecked: any): void;
    getMapping(): Mapping;
    setColorScale(colorScale: any): void;
    setBrightnessByChannel(channel: CategoryOption, range: any): void;
    sizeCat(category: CategoryOption, range: any): void;
    updateSize(): void;
    updateColor(): void;
    isPointVisible(vector: IVector): boolean;
    updatePosition(projection: IBaseProjection): void;
    update(): void;
    /**
     * Highlights a specific point index.
     */
    highlight(index: any): void;
    /**
     * Updates the zoom level.
     */
    zoom(zoom: any, projection: any): void;
    /**
     * Cleans this object.
     */
    dispose(): void;
}
