


var pointSprite = `
    uniform vec3 color;
    uniform sampler2D pointTexture[4];
    
    varying vec4 vColor;
    varying float vType;
    varying float vShow;
    varying float vSelected;

    void main() {
        gl_FragColor = vColor;

        if (vShow <= 0.1) {
            discard;
        }

        if (vType == 0.0) {
            gl_FragColor = gl_FragColor * texture2D(pointTexture[0], gl_PointCoord);
        } else if (vType == 1.0) {
            gl_FragColor = gl_FragColor * texture2D(pointTexture[1], gl_PointCoord);
        } else if (vType == 2.0) {
            gl_FragColor = gl_FragColor * texture2D(pointTexture[2], gl_PointCoord);
        } else {
            gl_FragColor = gl_FragColor * texture2D(pointTexture[3], gl_PointCoord);
        }



        if ( gl_FragColor.a < ALPHATEST ) discard;
    }
`

module.exports = {
    pointSprite: pointSprite
}