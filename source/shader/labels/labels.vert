const labelsVS = `#version 300 es
precision mediump float;
precision mediump int;

uniform int u_labelCount;
uniform vec3 u_camPos;

layout(location = 0) in vec2 pos;
layout(location = 1) in vec2 texCoord;
layout(location = 2) in vec3 scenePos;
layout(location = 3) in int ID;

out vec3 fragTexCoord;
flat out vec3 fragScenePos;
flat out int fragLabelID;
out float test;

void main() {
    fragTexCoord = vec3(texCoord, (float(ID) + 0.5) / float(u_labelCount));
    fragScenePos = scenePos;
    fragLabelID = ID;
    test = (float(ID) + 0.5) / float(u_labelCount);

    gl_Position = vec4(pos.x, pos.y, 0., 1.);
}
`;
