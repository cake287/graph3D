const labelsFS = `#version 300 es
precision mediump float;
precision mediump int;

uniform vec3 u_camPos;
uniform int u_labelCount;
uniform mediump sampler3D u_texture;

// in vec2 fragTexCoord;
in vec3 fragTexCoord;
flat in vec3 fragScenePos;
flat in int fragLabelID;
in float test;

out vec4 colour;

//#define BORDER
//#define BACKGROUND

void main() {
    const float cameraDepth = 30.;

    #ifdef BORDER
    const float border = 0.04;
    if (fragTexCoord.x < border || fragTexCoord.y < border || fragTexCoord.x > 1. - border || fragTexCoord.y > 1. - border)
        colour = vec4(vec3(0.4), 1.);
    else
    #endif
        colour = texture(u_texture, fragTexCoord);

    #ifdef BACKGROUND
    if (colour.a < 0.01)
        if (u_labelCount == 7)
            colour = vec4(vec3(0.), 1.);
    #endif


    gl_FragDepth = length(fragScenePos - u_camPos) / cameraDepth;
}

`;