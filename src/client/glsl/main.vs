#version 100

attribute vec3 pos;
attribute vec3 norm;

varying vec3 frag_pos;
varying vec3 frag_norm;

uniform mat4 mvp;
uniform mat4 model;

void main()
{
	frag_pos = vec3(model * vec4(pos, 1));
	frag_norm = normalize(vec3(model * vec4(norm, 0)));

	gl_Position = mvp * vec4(pos, 1);
}
