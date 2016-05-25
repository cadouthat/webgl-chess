#version 100

attribute vec2 pos;

varying vec2 frag_uv;

void main()
{
	//Frag UV is position with scale adjusted
	frag_uv = (pos + vec2(1, 1)) / 2.0;

	//Position is simply converted from 2D
	gl_Position = vec4(pos, 0, 1);
}
