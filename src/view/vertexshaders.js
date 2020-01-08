var pointSprite = `
    uniform float zoom;
    uniform float scale;

    // Attributes of point sprites
    attribute float size;
    attribute vec4 customColor;
    attribute float type;
    attribute float show;

    // Varying of point sprites
    varying vec4 vColor;
    varying float vType;
    varying float vShow;

    void main() {
        vColor = customColor;
        vType = type;
        vShow = show;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = ((size / 2.0) + (size / 16.0) * (zoom / 3.0)) * scale;
        gl_Position = projectionMatrix * mvPosition;
    }
`



module.exports = {
    pointSprite: pointSprite
}