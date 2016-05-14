#version 100

precision mediump float;

varying vec3 frag_pos;
varying vec3 frag_norm;
varying vec2 frag_uv;

uniform vec3 eye;
uniform sampler2D tex;

float ambient = 0.2;
vec3 light[3];
bool light_init = false;
float specPower = 64.0;

void main()
{
	vec3 texture_mask = vec3(texture2D(tex, frag_uv));
	vec3 color_diffuse = vec3(1.0) * texture_mask;
	vec3 color_specular = vec3(1.0);

	if(!light_init)
	{
		light_init = true;
		light[0] = normalize(vec3(-1.0, 1.0, 0.0));
		light[1] = normalize(vec3(0.866, 1.0, 0.5));
		light[2] = normalize(vec3(0.866, 1.0, -0.5));
	}

	vec3 total_color = ambient * color_diffuse;

	const int n_lights = 3;
	for(int i = 0; i < n_lights; i++)
	{
		float diffuse = dot(frag_norm, light[i]);
		diffuse = clamp(diffuse, 0.0, 1.0) * (1.0 - ambient) / float(n_lights);
		total_color += diffuse * color_diffuse;

		if(diffuse > 0.0)
		{
			vec3 reflected = normalize(reflect(-light[i], frag_norm));
			vec3 vEye = normalize(eye - frag_pos);
			float specular = dot(vEye, reflected);
			if(specular > 0.0 && specular < 1.0)
			{
				specular = pow(specular, specPower);
			}
			else specular = clamp(specular, 0.0, 1.0);

			total_color += specular * (1.0 - ambient) * color_specular;
		}
	}

	gl_FragColor = vec4(total_color, 1.0);
}
