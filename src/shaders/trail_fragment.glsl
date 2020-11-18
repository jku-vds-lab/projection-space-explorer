uniform vec3 color;
uniform sampler2D atlas;

varying vec4 vColor;
varying float vType;
varying float vShow;
varying float vSelected;

void main() {
    gl_FragColor = vColor;

    gl_FragColor = gl_FragColor * texture2D(atlas, gl_PointCoord);

    if ( gl_FragColor.a < 0.05 ) discard;
}