/* eslint-disable @typescript-eslint/no-var-requires */
import THREE = require('three');

// @ts-ignore
import WhiteSq from '../../../textures/sprites/square_white.png';

const fragmentShader = require('../../shaders/trail_fragment.glsl');
const vertexShader = require('../../shaders/trail_vertex.glsl');

export class TrailVisualization {
  mesh: THREE.Points<THREE.BufferGeometry, THREE.Material>;

  maxLength = 50;

  create() {
    // hardcoded for 30 clusters, needs to be changed
    const len = 100 * 30;

    const positions = new Float32Array(len * 3);
    const colors = new Float32Array(len * 4);
    const sizes = new Float32Array(len);
    const types = new Float32Array(len);
    const show = new Float32Array(len);
    const selected = new Float32Array(len);

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 4));
    pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    pointGeometry.setAttribute('type', new THREE.BufferAttribute(types, 1));
    pointGeometry.setAttribute('show', new THREE.BufferAttribute(show, 1));
    pointGeometry.setAttribute('selected', new THREE.BufferAttribute(selected, 1));

    //
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        zoom: { value: 1.0 },
        color: { value: new THREE.Color(0xffffff) },
        scale: { value: 1.0 },
        atlas: {
          value: new THREE.TextureLoader().load(WhiteSq),
        },
      },
      transparent: true,
      vertexShader,
      fragmentShader,
      alphaTest: 0.05,
    });

    this.mesh = new THREE.Points(pointGeometry, pointMaterial);
    this.mesh.frustumCulled = false;
  }

  update(clusterObjects, zoom) {
    let i = 0;

    const position = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
    const color = this.mesh.geometry.attributes.customColor as THREE.BufferAttribute;
    clusterObjects.forEach((clusterObject) => {
      const range = Math.min(this.maxLength, clusterObject.trailPositions.length);

      for (let j = 0; j < range; j++, i++) {
        const vector = clusterObject.trailPositions[clusterObject.trailPositions.length - 1 - j];

        position.setXYZ(i, vector.x * zoom, vector.y * zoom, -2);
        color.setXYZW(i, 0.33, 0.33, 0.33, 0.5 * ((clusterObject.trailPositions.length - 1 - j) / clusterObject.trailPositions.length));

        i += 1;
      }
    });

    // Only draw necessary part
    this.mesh.geometry.setDrawRange(0, i);

    position.needsUpdate = true;
    color.needsUpdate = true;
  }

  setVisible(show: boolean) {
    this.mesh.visible = show;
  }

  setLength(length: number) {
    this.maxLength = length;
  }
}
