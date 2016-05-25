#version 100

attribute vec3 pos;

uniform mat4 mvp;
uniform mat4 model;

void main()
{
	//Output position in screen space
	gl_Position = mvp * vec4(pos, 1);
}
