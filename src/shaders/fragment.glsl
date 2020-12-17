uniform vec3 color;
uniform sampler2D atlas;

varying vec4 vColor;
varying float vType;
varying float vShow;
varying float vSelected;

void main() {
    gl_FragColor = vColor;

    if (vShow <= 0.1) {
        discard;
    }

    gl_FragColor = gl_FragColor * texture2D(atlas, vec2(vType * 0.25, 0.75) + gl_PointCoord * 0.25);

    if (vSelected > 0.5) {
        vec4 border = texture2D(atlas, vec2(vType * 0.25, 0.5) + gl_PointCoord * 0.25);
        gl_FragColor = mix(gl_FragColor, border, border.a);
    }

    if ( gl_FragColor.a < ALPHATEST ) discard;
}