#version 100

precision mediump float;

varying vec3 frag_pos;
varying vec3 frag_norm;
varying vec2 frag_uv;

uniform vec3 eye;
uniform sampler2D tex;
uniform vec2 uvOffset;

float ambient = 0.4;
vec3 light[3];
bool light_init = false;
float specPower = 96.0;

void main()
{
	//Sample texture for diffuse color
	vec3 color_diffuse = vec3(texture2D(tex, frag_uv + uvOffset));

	//Specular is pure white
	vec3 color_specular = vec3(1.0);

	//Static lighting data - hacky GLSL 100 initializer
	if(!light_init)
	{
		light_init = true;
		light[0] = normalize(vec3(-1.0, 1.0, 0.0));
		light[1] = normalize(vec3(0.866, 1.0, 0.5));
		light[2] = normalize(vec3(0.866, 1.0, -0.5));
	}

	//Start with ambient (same color as diffuse)
	vec3 total_color = ambient * color_diffuse;

	//Loop each light
	const int n_lights = 3;
	for(int i = 0; i < n_lights; i++)
	{
		//Diffuse surface lighting for infinite distance light
		float diffuse = dot(frag_norm, light[i]);

		//Clamp to real values and scale down by ambient light and number of lights
		diffuse = clamp(diffuse, 0.0, 1.0) * (1.0 - ambient) / float(n_lights);

		total_color += diffuse * color_diffuse;

		//Specular only applies to lit faces
		if(diffuse > 0.0)
		{
			//Infinite light reflected across surface
			vec3 reflected = normalize(reflect(-light[i], frag_norm));

			//Check against direction from surface to eye
			vec3 vEye = normalize(eye - frag_pos);
			float specular = dot(vEye, reflected);

			//Apply specular exponent
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
