const axesFS = `#version 300 es
precision mediump float;
precision mediump int;

uniform vec3 u_originOffset;
uniform vec2 u_resolution;
uniform vec3 u_camPos;
uniform vec3 u_camTar;
uniform mat3 u_camMat;
uniform int u_projectionID;

#define RENDER_AXES
#define COLOUR_AXES

flat in vec3 lineDir;
flat in vec3 linePoint;
flat in int lineType;

out vec4 colour;


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
    // the shortest distance between the two lines is the line which is perpendicular to both

    vec3 cDir = normalize(cross(aDir, bDir));

    mat3 coefficients = mat3(-1. * aDir, bDir, cDir);
    vec3 vals = aPoint - bPoint;
    float tA = solveSimulEqsForX(coefficients, vals);

    return aPoint + tA * aDir;
}

// bool floatEquals(float a, float b) {
//     return abs(a - b) < 0.01;
// }
// bool vec3Equals(vec3 a, vec3 b) {
//     return floatEquals(a.x, b.x) &&
//         floatEquals(a.y, b.y) &&
//         floatEquals(a.z, b.z);
// }


void main() {
    // in theory, i could have used gl_FragCoord.z or a custom attribute for depth, as it would be interpolated
    // this produced:
    // for gl_FragCoord.z - completely flat depth
    // for the custom attribute - slightly innaccurate depth in some cases

    // instead, i'm recalculating depth on a per-pixel basis.   


    const float cameraDepth = 30.;
    const float focalLength = 1.5;
    const float axisLength = 3.5;

    vec2 uv = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;

    vec3 rayOrigin = u_camPos;
    vec3 rayDir = vec3(1.);
    if (u_projectionID == 100) {
        rayDir = u_camMat * normalize(vec3(uv.x, uv.y, focalLength));
    }
    else if (u_projectionID == 200) {
        const float orthoScale = 5.;
        rayDir = normalize(u_camTar - u_camPos);
        vec3 camRight = normalize(cross(rayDir, vec3(0., 1., 0.)));
        vec3 camUp = normalize(cross(camRight, rayDir));
        rayOrigin += orthoScale * (camRight * uv.x + camUp * uv.y);
    }


    vec3 lineSource = linePoint;
    if (lineType == 1)
        lineSource += u_originOffset;

    vec3 closestAxisPoint = findClosestPoint(lineSource, lineDir, rayOrigin, rayDir);
    float depth = length(closestAxisPoint - rayOrigin) / cameraDepth;

    colour = vec4(vec3(0.), 1.);

    // if line point = (0, 0, 0), the line is an axis line. otherwise, the line is a grid line
    if (lineType == 1) {
        #ifdef COLOUR_AXES
            colour.rgb = lineDir;
        #endif

        float e = 0.01;
        if (
            closestAxisPoint.x < -axisLength + e ||
            closestAxisPoint.y < -axisLength + e ||
            closestAxisPoint.z < -axisLength + e ||
            closestAxisPoint.x >  axisLength - e ||
            closestAxisPoint.y >  axisLength - e ||
            closestAxisPoint.z >  axisLength - e
        ) {
            colour.rgb = vec3(0.6);
        }
    } else if (lineType == 2)
        colour.rgb = vec3(0.4);


    //colour.rgb = vec3(depth);

    gl_FragDepth = depth;
}

`;