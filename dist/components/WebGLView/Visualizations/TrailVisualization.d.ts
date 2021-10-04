import THREE = require("three");
export declare class TrailVisualization {
    mesh: THREE.Points<THREE.BufferGeometry, THREE.Material>;
    maxLength: number;
    create(clusterObjects: any): void;
    update(clusterObjects: any, zoom: any): void;
    setVisible(show: boolean): void;
    setLength(length: number): void;
}
