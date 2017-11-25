#ifdef GL_ES
precision highp float;
#endif
uniform float R;
uniform float G;
uniform float B;

varying vec4 vFinalColor;

void main() {
		gl_FragColor =  vec4(R, 0, 0, 1.0)+vFinalColor;
}