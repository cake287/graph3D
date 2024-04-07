const axesVS = `#version 300 es
precision mediump float;
precision mediump int;

uniform vec3 u_originOffset;
uniform vec3 u_camPos;
uniform vec3 u_camTar;
uniform mat3 u_camMat;
uniform int u_projectionID;


layout(location = 0) in vec2 pos;
layout(location = 1) in vec3 inLineDir;
layout(location = 2) in vec3 inLinePoint;
layout(location = 3) in int inLineType;

// flat keyword means axis vector won't be interpolated between vertices
// in reality it's redundant because all vertices in a triangle are part of the same line 
flat out vec3 lineDir;
flat out vec3 linePoint;
flat out int lineType;

out float v_depth;

float solveSimulEqsForX(mat3 coefficients, vec3 vals) {
    // uses cramer's rule to solve 3 simultaneous equations, only solving for the x variable

    // note that the "x" variable doesn't correspond to the spatial x variable here
    // if we solved for all variables in the simul eqs, x => tA, y => tB, z => tC

    float D = determinant(coefficients);
    coefficients[0] = vals;
    float Dx = determinant(coefficients);

    return Dx / D;
}


vec3 findClosestPoint(vec3 aPoint, vec3 aDir, vec3 bPoint, vec3 bDir) {
    // note to self - explanation diagram is in \NEA\sketches\

    // find the point on line A, closest to line B
    // the shortest distance between the two lines is the one which is perpendicular to both

    vec3 cDir = normalize(cross(aDir, bDir));

    mat3 coefficients = mat3(-1. * aDir, bDir, cDir);
    vec3 vals = aPoint - bPoint;
    float tA = solveSimulEqsForX(coefficients, vals);

    return aPoint + tA * aDir;
}

void main() {
    const float cameraDepth = 30.;
    const float focalLength = 1.5;
    
    lineDir = inLineDir;
    linePoint = inLinePoint;
    lineType = inLineType;

    vec3 rayOrigin = u_camPos;
    vec3 rayDir = vec3(1.);
    if (u_projectionID == 100) {
        rayDir = u_camMat * normalize(vec3(pos.x, pos.y, focalLength));
    }
    else if (u_projectionID == 200) {
        const float orthoScale = 5.;
        rayDir = normalize(u_camTar - u_camPos);
        vec3 camRight = normalize(cross(rayDir, vec3(0., 1., 0.)));
        vec3 camUp = normalize(cross(camRight, rayDir));
        rayOrigin += orthoScale * (camRight * pos.x + camUp * pos.y);
    }

    vec3 lineSource = linePoint;
        if (lineType == 1)
            lineSource += u_originOffset;

    vec3 closestAxisPoint = findClosestPoint(lineSource, lineDir, u_camPos, rayDir);
    float depth = length(closestAxisPoint - u_camPos) / cameraDepth;


    gl_Position = vec4(pos.x, pos.y, depth, 1.);
}
`;
