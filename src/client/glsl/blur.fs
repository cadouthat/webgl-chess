#version 100

precision mediump float;

varying vec2 frag_uv;

uniform sampler2D tex;
uniform vec2 texSize;
uniform int blurDirection;
uniform vec3 color;

void main()
{
	vec2 pos = frag_uv;

	vec2 ds = 1.0 / texSize;

	float result = 0.0;
	if(blurDirection > 0)
	{
		pos.y -= 4.0 * ds.y;
		result += texture2D(tex, pos).a * 0.028532;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.067234;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.124009;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.179044;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.20236;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.179044;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.124009;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.067234;
		pos.y += ds.y;
		result += texture2D(tex, pos).a * 0.028532;
	}
	else
	{
		pos.x -= 4.0 * ds.x;
		result += texture2D(tex, pos).a * 0.028532;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.067234;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.124009;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.179044;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.20236;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.179044;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.124009;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.067234;
		pos.x += ds.x;
		result += texture2D(tex, pos).a * 0.028532;
	}

	gl_FragColor = vec4(color * result, result);
}
