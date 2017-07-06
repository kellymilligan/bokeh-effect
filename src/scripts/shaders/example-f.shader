uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

void main() {

    gl_FragColor = vec4( gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 0.5, 1.0 );
}