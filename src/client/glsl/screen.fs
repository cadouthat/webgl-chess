#version 100

precision mediump float;

varying vec2 frag_uv;

uniform sampler2D tex;

void main()
{
	gl_FragColor = texture2D(tex, frag_uv);
}
