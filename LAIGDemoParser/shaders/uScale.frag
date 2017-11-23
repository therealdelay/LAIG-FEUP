#ifdef GL_ES
precision highp float;
#endif
uniform float R;

void main() {
		gl_FragColor =  vec4(R,0,0, 1.0);
}