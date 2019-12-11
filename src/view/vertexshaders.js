var pointSprite = `
    uniform float zoom;

    // Attributes of point sprites
    attribute float size;
    attribute vec4 customColor;
    attribute float type;

    // Varying of point sprites
    varying vec4 vColor;
    varying float vType;

    void main() {
        vColor = customColor;
        vType = type;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = (size / 2.0) + (size / 16.0) * (zoom / 3.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`



module.exports = {
    pointSprite: pointSprite
}